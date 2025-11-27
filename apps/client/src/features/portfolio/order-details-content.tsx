"use client";

import { ReceiptViewer } from "@/app/[locale]/admin/orders/[orderId]/_components/receipt-viewer";
import {
  cancelMyOrder,
  requestReturn
} from "@/actions/profile.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { EOrderStatus, EPaymentStatus, TOrderDetail, TPayment } from "@repo/common";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  MessageCircle,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  X,
  XCircle as XCircleIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { OrderTrackingModal } from "./order-tracking-modal";

interface OrderDetailsContentProps {
  order: TOrderDetail;
  payments: TPayment[];

}

export function OrderDetailsContent({ order, payments }: OrderDetailsContentProps) {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: (reason?: string) => cancelMyOrder(order.id, reason),
    onSuccess: () => {
      toast.success("Order Cancelled", {
        description: "Your order has been successfully cancelled.",
      });
      setIsCancelDialogOpen(false);
      setCancellationReason("");
    },
    onError: (error: any) => {
      toast.error("Cancellation Failed", {
        description:
          error.message || "Failed to cancel order. Please try again.",
      });
    },
  });

  const handleCancelOrder = () => {
    cancelMutation.mutate(cancellationReason.trim() || "");
  };

  // Return request mutation
  const returnMutation = useMutation({
    mutationFn: (reason?: string) => requestReturn(order.id, reason),
    onSuccess: () => {
      toast.success("Return Request Submitted", {
        description:
          "Your return request has been submitted successfully. We will contact you shortly.",
      });
      setIsReturnDialogOpen(false);
      setReturnReason("");
    },
    onError: (error: any) => {
      toast.error("Return Request Failed", {
        description:
          error.message || "Failed to submit return request. Please try again.",
      });
    },
  });

  const handleReturnRequest = () => {
    returnMutation.mutate(returnReason.trim() || "");
  };

  const getOrderStatusColor = (status: EOrderStatus) => {
    const colors = {
      [EOrderStatus.pending]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [EOrderStatus.confirmed]: "bg-blue-100 text-blue-800 border-blue-200",
      [EOrderStatus.processing]: "bg-purple-100 text-purple-800 border-purple-200",
      [EOrderStatus.shipped]: "bg-indigo-100 text-indigo-800 border-indigo-200",
      [EOrderStatus.delivered]: "bg-green-100 text-green-800 border-green-200",
      [EOrderStatus.cancelled]: "bg-red-100 text-red-800 border-red-200",
      [EOrderStatus.refunded]: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status: EPaymentStatus) => {
    const colors = {
      [EPaymentStatus.pending]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [EPaymentStatus.paid]: "bg-green-100 text-green-800 border-green-200",
      [EPaymentStatus.failed]: "bg-red-100 text-red-800 border-red-200",
      [EPaymentStatus.refunded]: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: EOrderStatus) => {
    const icons = {
      [EOrderStatus.pending]: Clock,
      [EOrderStatus.confirmed]: CheckCircle,
      [EOrderStatus.processing]: Package,
      [EOrderStatus.shipped]: Truck,
      [EOrderStatus.delivered]: CheckCircle,
      [EOrderStatus.cancelled]: XCircleIcon,
      [EOrderStatus.refunded]: RefreshCw,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/my-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex items-center space-x-4">
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.paymentStatus === EPaymentStatus.paid ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTrackingModalOpen(true)}
            >
              <Truck className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          ) : (
            <Button asChild size='sm' className='w-full sm:w-auto'>
              <Link href={`/checkout/${order.id}/payment`}>
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        <p className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Order Status</p>
                <Badge className={`${getOrderStatusColor(order.status)} border mt-1`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Status</p>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border mt-1`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Items</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {order.quantity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(order.total, order.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Items</span>
              </CardTitle>
              <CardDescription>
                {order.quantity} item(s) in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.quantity > 0 ? (
                  Array.from({ length: order.quantity }).map((_, index) => {
                    // Calculate individual item price (total / quantity)
                    const itemPrice = order.total / order.quantity;
                    // Each placeholder represents 1 unit
                    const itemQuantity = 1;

                    return (
                      <div key={`${order.id}-item-${index}`}>
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Book {index + 1}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Quantity: <span className="font-medium text-gray-900">{itemQuantity}</span></span>
                              <span>•</span>
                              <span>Price: <span className="font-medium text-gray-900">{formatCurrency(itemPrice, order.currency)}</span></span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-bold text-lg text-gray-900">{formatCurrency(itemPrice, order.currency)}</p>
                          </div>
                        </div>
                        {index < order.quantity - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">No items found</h4>
                      <p className="text-sm text-gray-600">
                        No items were found for this order
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payments Section */}
          {payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment History</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {payments.length} {payments.length === 1 ? 'Payment' : 'Payments'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  View all payment transactions for this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment, index) => (
                    <div key={payment.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-3 rounded-lg ${payment.paymentStatus === EPaymentStatus.paid ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                            {payment.paymentStatus === EPaymentStatus.paid ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : payment.paymentStatus === EPaymentStatus.failed ? (
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {payment.paymentMethod === 'bankTransfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                              </h4>
                              <Badge className={`${getPaymentStatusColor(payment.paymentStatus)} border text-xs`}>
                                {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div>
                                <span className="text-gray-500">Amount: </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(payment.amount, payment.currency)}
                                </span>
                              </div>
                              {payment.referenceNumber && (
                                <div>
                                  <span className="text-gray-500">Reference: </span>
                                  <span className="font-mono font-medium">{payment.referenceNumber}</span>
                                </div>
                              )}
                              {payment.paidAt && (
                                <div>
                                  <span className="text-gray-500">Paid: </span>
                                  <span className="text-green-700 font-medium">
                                    {new Date(payment.paidAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {payment.receiptData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Receipt
                          </Button>
                        )}
                      </div>
                      {index < payments.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Order Timeline</span>
              </CardTitle>
              <CardDescription>
                Track the progress of your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.statusHistory && order.statusHistory.length > 0 ? (
                <div className="space-y-4 relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {order.statusHistory.map((history, index) => (
                    <div
                      key={history.id}
                      className="flex items-start space-x-4 relative"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-100'
                          }`} />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-gray-900 capitalize">
                            {history.status.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(history.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mb-2">
                            {history.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Updated by {history.updatedBy.firstName}{" "}
                          {history.updatedBy.lastName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-1">No timeline available</p>
                  <p className="text-sm text-gray-400">
                    Order timeline will be updated as the order progresses
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <MapPin className="h-5 w-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.street}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No shipping address</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment & Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {order.paymentMethod === 'bankTransfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping Method</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {order.shippingMethod}
                </p>
              </div>
              {order.trackingNumber && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {order.trackingNumber}
                    </p>
                  </div>
                </>
              )}
              {order.estimatedDelivery && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal || 0, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(order.shipping || 0, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax || 0, order.currency)}
                  </span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(order.discount, order.currency)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(order.status === EOrderStatus.pending ||
                  order.status === EOrderStatus.confirmed) && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setIsCancelDialogOpen(true)}
                      disabled={cancelMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {cancelMutation.isPending
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </Button>
                  )}

                {order.status === EOrderStatus.delivered && (
                  <>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Leave Review
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsReturnDialogOpen(true)}
                      disabled={returnMutation.isPending}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {returnMutation.isPending
                        ? "Submitting..."
                        : "Request Return"}
                    </Button>
                  </>
                )}

                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes Section */}
      {(order.customerNotes || order.notes) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.customerNotes && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Customer Notes</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.customerNotes}</p>
              </div>
            )}
            {order.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Store Notes</p>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tracking Modal */}
      <OrderTrackingModal
        orderId={order.id}
        orderNumber={order.orderNumber}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Receipt Viewer */}
      {selectedPayment && (
        <ReceiptViewer
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          setIsCancelDialogOpen(open);
          if (!open) setCancellationReason("");
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
              {order.paymentStatus === EPaymentStatus.paid && (
                <span className="block mt-2 text-blue-600 font-medium">
                  A refund will be processed to your original payment method.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="cancellation-reason">
              Reason for cancellation (optional)
            </Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Please tell us why you want to cancel this order..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              disabled={cancelMutation.isPending}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Your feedback helps us improve our service.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>
              No, Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Request Dialog */}
      <AlertDialog
        open={isReturnDialogOpen}
        onOpenChange={(open) => {
          setIsReturnDialogOpen(open);
          if (!open) setReturnReason("");
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Request Return</AlertDialogTitle>
            <AlertDialogDescription>
              Submit a return request for this order. Our team will review your
              request and contact you within 24-48 hours.
              <span className="block mt-2 text-blue-600 font-medium">
                Returns are accepted within 30 days of delivery.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="return-reason">Reason for return (optional)</Label>
            <Textarea
              id="return-reason"
              placeholder="Please tell us why you want to return this order (e.g., wrong size, defective item, not as described)..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              disabled={returnMutation.isPending}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Providing details helps us process your return faster.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={returnMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReturnRequest}
              disabled={returnMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {returnMutation.isPending
                ? "Submitting..."
                : "Submit Return Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
