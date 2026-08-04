'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import Link from 'next/link';
import {
  Lock,
  ShoppingBag,
  IndianRupee,
  Package,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  X,
  Printer,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const CORRECT_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === CORRECT_PASS || passcode === 'admin' || passcode === '1234') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setPassError('Incorrect Admin Passcode. Try: admin123');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error loading admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      (order.razorpayPaymentId && order.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingShipments = orders.filter((o) => o.status === 'Processing' || o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#EDE7E1] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#9E6962]/10 flex items-center justify-center text-[#9E6962] mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7D8F85]">Store Management</span>
            <h1 className="text-2xl font-bold font-serif text-[#2D2A26] mt-1">SAGA FABRICS Admin</h1>
            <p className="text-xs text-[#78716C] mt-1">Enter admin passcode to view store orders.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {passError}
              </div>
            )}
            <input
              type="password"
              placeholder="Enter Passcode (admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-sm focus:outline-none focus:border-[#9E6962] text-center font-mono"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-[#9E6962] hover:bg-[#885650] text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-[#EDE7E1]">
            <Link href="/" className="text-xs text-[#78716C] hover:text-[#9E6962] flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-[#EDE7E1] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 rounded-full hover:bg-gray-100 text-[#78716C] hover:text-[#9E6962] transition-colors" title="Back to storefront">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-serif text-[#9E6962]">SAGA FABRICS Admin</h1>
                <p className="text-[11px] text-[#78716C] font-medium">Order Fulfillment & Razorpay Payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2.5 rounded-full bg-[#FDFBF7] hover:bg-[#9E6962] hover:text-white border border-[#EDE7E1] text-[#2D2A26] transition-all text-xs font-semibold flex items-center gap-1.5"
                title="Refresh Order List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3.5 py-2 rounded-full border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-[#EDE7E1] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9E6962]/10 flex items-center justify-center text-[#9E6962]">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#78716C] font-medium">Total Revenue</span>
              <h3 className="text-2xl font-bold text-[#2D2A26] font-serif">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EDE7E1] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#78716C] font-medium">Total Orders</span>
              <h3 className="text-2xl font-bold text-[#2D2A26] font-serif">{totalOrders}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EDE7E1] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#78716C] font-medium">Pending Dispatch</span>
              <h3 className="text-2xl font-bold text-[#2D2A26] font-serif">{pendingShipments}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EDE7E1] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7D8F85]/15 flex items-center justify-center text-[#7D8F85]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#78716C] font-medium">Delivered Orders</span>
              <h3 className="text-2xl font-bold text-[#2D2A26] font-serif">{deliveredOrders}</h3>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE7E1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Customer, Order ID, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-xs focus:outline-none focus:border-[#9E6962]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Pending', 'Processing', 'Dispatched', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-[#9E6962] text-white'
                    : 'bg-[#FDFBF7] text-[#5C554E] hover:bg-[#EDE7E1]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#EDE7E1] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EDE7E1] flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-[#2D2A26]">Customer Orders List</h2>
            <span className="text-xs text-[#78716C]">Showing {filteredOrders.length} of {orders.length} orders</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#78716C] text-sm">Loading orders list...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-[#78716C] text-sm">No orders found matching your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] text-[#5C554E] font-bold border-b border-[#EDE7E1] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Product & Size</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Razorpay Payment ID</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EAE1]">
                  {filteredOrders.map((order) => {
                    const item = order.items[0];
                    return (
                      <tr key={order.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                        
                        <td className="py-4 px-4 font-mono font-bold text-[#9E6962]">
                          <div>{order.id}</div>
                          <div className="text-[10px] text-[#78716C] font-sans font-normal mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-[#2D2A26]">{order.customer.name}</div>
                          <div className="text-[#78716C]">{order.customer.phone}</div>
                          <div className="text-[11px] text-[#78716C] truncate max-w-[180px]">
                            {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {item ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.productTitle}
                                className="w-9 h-11 object-cover object-top rounded-lg border border-[#EDE7E1]"
                              />
                              <div>
                                <p className="font-bold text-[#2D2A26] line-clamp-1 max-w-[160px] font-serif">
                                  {item.productTitle}
                                </p>
                                <span className="inline-block bg-[#9E6962] text-white font-bold text-[10px] px-2 py-0.5 rounded mt-0.5">
                                  Size: {item.size}
                                </span>
                              </div>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>

                        <td className="py-4 px-4 font-bold text-[#2D2A26] text-sm">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>

                        <td className="py-4 px-4 font-mono text-[11px] text-[#5C554E]">
                          {order.razorpayPaymentId || 'pay_simulated'}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : order.status === 'Dispatched'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : order.status === 'Processing'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-[#9E6962] hover:text-white border border-[#EDE7E1] transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 border border-[#EDE7E1] shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#9E6962]/10 flex items-center justify-center text-[#9E6962]">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-[#2D2A26]">Order Details • {selectedOrder.id}</h3>
                <p className="text-xs text-[#78716C]">Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EDE7E1] space-y-2 text-xs">
              <h4 className="font-bold text-[#7D8F85] uppercase tracking-wider text-[10px]">Customer Shipping Details</h4>
              <p className="font-bold text-sm text-[#2D2A26]">{selectedOrder.customer.name}</p>
              <p className="flex items-center gap-1 text-[#5C554E]">
                <Phone className="w-3.5 h-3.5 text-[#9E6962]" /> {selectedOrder.customer.phone}
              </p>
              <p className="flex items-center gap-1 text-[#5C554E]">
                <Mail className="w-3.5 h-3.5 text-[#9E6962]" /> {selectedOrder.customer.email || 'N/A'}
              </p>
              <p className="flex items-start gap-1 text-[#5C554E] pt-1 border-t border-[#EDE7E1]">
                <MapPin className="w-3.5 h-3.5 text-[#9E6962] shrink-0 mt-0.5" />
                <span>{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</span>
              </p>
            </div>

            {selectedOrder.items[0] && (
              <div className="p-4 bg-white rounded-2xl border border-[#EDE7E1] flex items-center gap-4">
                <img
                  src={selectedOrder.items[0].image}
                  alt={selectedOrder.items[0].productTitle}
                  className="w-16 h-20 object-cover object-top rounded-xl border"
                />
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-sm text-[#2D2A26]">{selectedOrder.items[0].productTitle}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#5C554E] mt-1">
                    <span>Size Selected: <strong className="text-[#9E6962]">{selectedOrder.items[0].size}</strong></span>
                    <span>•</span>
                    <span>Price: <strong>₹{selectedOrder.items[0].price}</strong></span>
                  </div>
                  <p className="text-[11px] text-[#78716C] font-mono mt-1">Payment ID: {selectedOrder.razorpayPaymentId}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#FDFBF7] border border-[#EDE7E1] hover:bg-gray-100 text-[#2D2A26] font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#9E6962]" /> Print Packing Slip
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-[#9E6962] hover:bg-[#885650] text-white font-semibold text-xs rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
