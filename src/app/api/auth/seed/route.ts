import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { ProductModel } from "@/models/Product";
import { CategoryModel } from "@/models/Category";
import { CouponModel } from "@/models/Coupon";
import { ReviewModel } from "@/models/Review";
import { OrderModel } from "@/models/Order";
import { SettingsModel } from "@/models/Settings";
import { NotificationModel } from "@/models/Notification";
import { jsonResponse } from "@/lib/auth";
import {
  initialUsers,
  initialCategories,
  initialCoupons,
  initialReviews,
  initialOrders,
  initialNotifications,
  initialSettings,
  inMemoryStore,
} from "@/lib/inMemoryStore";

export async function POST() {
  const db = await connectToDatabase();

  if (db) {
    try {
      // 1. Seed Users if empty
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        await UserModel.insertMany(initialUsers);
      }

      // 2. Seed Products if empty
      const productCount = await ProductModel.countDocuments();
      if (productCount === 0) {
        await ProductModel.insertMany(inMemoryStore.products);
      }

      // 3. Seed Categories if empty
      const catCount = await CategoryModel.countDocuments();
      if (catCount === 0) {
        await CategoryModel.insertMany(initialCategories);
      }

      // 4. Seed Coupons if empty
      const couponCount = await CouponModel.countDocuments();
      if (couponCount === 0) {
        await CouponModel.insertMany(initialCoupons);
      }

      // 5. Seed Reviews if empty
      const reviewCount = await ReviewModel.countDocuments();
      if (reviewCount === 0) {
        await ReviewModel.insertMany(initialReviews);
      }

      // 6. Seed Orders if empty
      const orderCount = await OrderModel.countDocuments();
      if (orderCount === 0) {
        await OrderModel.insertMany(initialOrders);
      }

      // 7. Seed Settings if empty
      const settingsCount = await SettingsModel.countDocuments();
      if (settingsCount === 0) {
        await SettingsModel.create(initialSettings);
      }

      // 8. Seed Notifications if empty
      const notifCount = await NotificationModel.countDocuments();
      if (notifCount === 0) {
        await NotificationModel.insertMany(initialNotifications);
      }

      return jsonResponse({
        success: true,
        message: "Database seeded successfully!",
        seededMongoDB: true,
      });
    } catch (err) {
      console.error("Seeding error:", err);
    }
  }

  return jsonResponse({
    success: true,
    message: "In-memory database initialized!",
    seededMongoDB: false,
  });
}

export async function GET() {
  return POST();
}
