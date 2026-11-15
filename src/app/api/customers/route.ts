import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { listStoreRecords } from "@/lib/firebaseStore";

type SheetCustomer = {
  id: string | number;
  email: string;
  [key: string]: unknown;
};

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN")
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);

  try {
    const [orderCustomers, userProfiles] = await Promise.all([
      listStoreRecords<SheetCustomer>("Customers"),
      listStoreRecords<SheetCustomer>("Users"),
    ]);
    const customersByEmail = new Map<string, SheetCustomer>();
    for (const customer of orderCustomers) {
      if (customer.email) customersByEmail.set(customer.email.toLowerCase(), customer);
    }
    for (const profile of userProfiles) {
      if (profile.email) {
        const key = profile.email.toLowerCase();
        customersByEmail.set(key, {
          ...profile,
          ...(customersByEmail.get(key) || {}),
          id: customersByEmail.get(key)?.id || profile.id,
          authUid: profile.id,
        });
      }
    }
    return jsonResponse(Array.from(customersByEmail.values()));
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load customers" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
