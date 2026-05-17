import { NextRequest, NextResponse } from 'next/server';
import { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-001',
    userId: 'user-001',
    type: 'new_rfq',
    title: 'New RFQ Posted',
    message: 'John Smith posted a new RFQ for electronics components',
    relatedToType: 'rfq',
    relatedToId: 'rfq-123',
    actionUrl: '/dashboard/rfq/123',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'n-002',
    userId: 'user-001',
    type: 'quotation_received',
    title: 'New Quotation',
    message: 'Russian Steel Works sent a quotation for your RFQ',
    relatedToType: 'quotation',
    relatedToId: 'q-456',
    actionUrl: '/dashboard/quotations/456',
    read: false,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'n-003',
    userId: 'user-001',
    type: 'message_received',
    title: 'New Message',
    message: 'Maria Garcia sent you a message',
    relatedToType: 'conversation',
    relatedToId: 'conv-001',
    actionUrl: '/dashboard/messages/conv-001',
    read: true,
    readAt: new Date(Date.now() - 10800000),
    createdAt: new Date(Date.now() - 10800000),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

    let filtered = MOCK_NOTIFICATIONS;

    if (userId) {
      filtered = filtered.filter((n) => n.userId === userId);
    }

    if (unreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const notifications = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        hasMore: start + limit < total,
        unreadCount: filtered.filter((n) => !n.read).length,
      },
    });
  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Notification fetch failed',
        code: 'NOTIFICATION_FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, relatedToType, relatedToId, actionUrl } = body;

    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      userId,
      type,
      title,
      message,
      relatedToType,
      relatedToId,
      actionUrl,
      read: false,
      createdAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully',
    });
  } catch (error) {
    console.error('Notification creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Notification creation failed',
        code: 'NOTIFICATION_CREATION_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, read } = body;

    // In a real implementation, this would update the database
    const notification = MOCK_NOTIFICATIONS.find((n) => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    notification.read = read;
    if (read) {
      notification.readAt = new Date();
    }

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Notification update failed',
        code: 'NOTIFICATION_UPDATE_ERROR',
      },
      { status: 500 }
    );
  }
}
