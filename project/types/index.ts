export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  specialInstructions?: string;
  MenuItem: {
    id: number;
    name: string;
    price: number;
  };
};

export interface Order {
  id: string;
  User: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
  };
  OrderItems: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: string;
  customerNotes?: string;
}

export interface CateringRequest {
  id: string;
  User: {
    name: string;
    email: string;
    phone?: string;
  };
  eventDate: string;
  guests: number;
  location: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  orderId: string;
  User: {
    name: string;
    email: string;
    phone?: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}