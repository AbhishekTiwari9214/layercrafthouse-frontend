import type {
  Cart,
  CheckoutPayload,
  CheckoutStartResponse,
  VerifyPaymentPayload,
  Order,
  Product,
  Transaction,
  User,
} from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "" : process.env.API_PROXY_URL || "http://127.0.0.1:8000");

function isNgrokClient() {
  if (typeof window === "undefined") {
    return /ngrok/i.test(process.env.NEXT_PUBLIC_API_URL || "");
  }
  return /ngrok/i.test(window.location.hostname);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      signal: options.signal ?? AbortSignal.timeout(20000),
      headers: {
        "Content-Type": "application/json",
        ...(isNgrokClient() ? { "ngrok-skip-browser-warning": "true" } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    const timedOut =
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    throw new ApiError(
      timedOut
        ? "Checkout API timed out. The backend never responded — check API_PROXY_URL."
        : "Network error — could not reach the server",
      0,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      response.ok
        ? "Unexpected server response"
        : `Server error (${response.status}). If using ngrok, restart the frontend after env changes.`,
      response.status,
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (
    response.ok &&
    payload &&
    typeof payload === "object" &&
    !("success" in payload) &&
    !("data" in payload)
  ) {
    throw new ApiError(
      `Server returned 200 without API data: ${JSON.stringify(payload).slice(0, 180)}`,
      502,
    );
  }

  if (!response.ok || payload.success === false) {
    const message =
      payload.message ||
      (response.status === 401
        ? "Invalid email or password"
        : `Request failed (${response.status})`);
    throw new ApiError(message, response.status || 500);
  }

  return payload as T;
}

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const api = {
  signup(body: { name: string; email: string; password: string }) {
    return request<ApiResponse<{ user: User }>>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: { email: string; password: string }) {
    return request<ApiResponse<{ user: User }>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  logout() {
    return request<{ success: boolean; message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  me() {
    return request<ApiResponse<{ user: User }>>("/api/auth/me");
  },

  updateProfile(body: {
    email?: string;
    phone?: string;
    address?: Partial<User["address"]>;
  }) {
    return request<ApiResponse<{ user: User }>>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  getSession() {
    return request<
      ApiResponse<{
        authenticated: boolean;
        user: User | null;
      }>
    >("/api/session");
  },

  getProducts() {
    return request<ApiResponse<{ products: Product[] }>>("/api/products");
  },

  getCart() {
    return request<ApiResponse<{ cart: Cart }>>("/api/cart");
  },

  addToCart(productId: string, quantity = 1) {
    return request<ApiResponse<{ cart: Cart }>>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem(productId: string, quantity: number) {
    return request<ApiResponse<{ cart: Cart }>>(`/api/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  checkout(body: CheckoutPayload) {
    return request<ApiResponse<CheckoutStartResponse>>("/api/payment/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  verifyPayment(body: VerifyPaymentPayload) {
    return request<ApiResponse<{ transaction: Transaction }>>("/api/payment/verify", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getOrderCount() {
    return request<ApiResponse<{ count: number }>>("/api/payment/orders/count");
  },

  getOrders() {
    return request<ApiResponse<{ orders: Order[] }>>("/api/payment/transactions");
  },

  getOrder(id: string) {
    return request<ApiResponse<{ order: Order }>>(`/api/payment/transactions/${id}`);
  },

  checkPincodeServiceability(pincode: string) {
    return request<
      ApiResponse<{
        serviceable: boolean;
        pincode: string;
        pickupPostcode: string;
        courierCount: number;
        estimatedDays: number | null;
        courierName: string | null;
        city: string;
        state: string;
        country: string;
        locality: string;
        message: string;
      }>
    >(`/api/shipping/serviceability?pincode=${encodeURIComponent(pincode)}`);
  },
};
