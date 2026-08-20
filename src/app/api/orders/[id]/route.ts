import { NextResponse } from 'next/server';
import { updateOrderStatus, deleteOrder, getOrderById } from '@/lib/db';
import { sendOrderStatusUpdateEmail } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Trigger status update email to customer asynchronously
    sendOrderStatusUpdateEmail(updatedOrder).catch((err) => {
      console.error(`[Order Status Update] Email failed for ${updatedOrder.id}:`, err);
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteOrder(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error deleting order' }, { status: 500 });
  }
}
