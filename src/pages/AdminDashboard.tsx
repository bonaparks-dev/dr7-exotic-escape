import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  RefreshCw, 
  DollarSign, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  RotateCcw
} from 'lucide-react';

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  nexi_transaction_id: string;
  created_at: string;
  completed_at: string | null;
  payer_email: string;
  payer_name: string;
  bookings: {
    vehicle_name: string;
    pickup_date: string;
    dropoff_date: string;
  };
}

interface RefundRequest {
  payment_id: string;
  amount: number;
  reason: string;
}

export default function AdminDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    pendingPayments: 0,
    failedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundRequest, setRefundRequest] = useState<RefundRequest>({
    payment_id: '',
    amount: 0,
    reason: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load payments with booking details
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            vehicle_name,
            pickup_date,
            dropoff_date
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (paymentsError) throw paymentsError;

      setPayments(paymentsData || []);

      // Calculate stats
      const totalRevenue = paymentsData
        ?.filter(p => p.payment_status === 'completed')
        ?.reduce((sum, p) => sum + p.amount, 0) || 0;

      const totalBookings = paymentsData?.length || 0;
      const pendingPayments = paymentsData?.filter(p => p.payment_status === 'pending').length || 0;
      const failedPayments = paymentsData?.filter(p => p.payment_status === 'failed').length || 0;

      setStats({
        totalRevenue,
        totalBookings,
        pendingPayments,
        failedPayments
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedPayment || !refundRequest.amount || !refundRequest.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all refund details',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('nexi-refund', {
        body: {
          paymentId: selectedPayment.id,
          amount: refundRequest.amount,
          reason: refundRequest.reason
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Refund processed successfully',
      });

      setSelectedPayment(null);
      setRefundRequest({ payment_id: '', amount: 0, reason: '' });
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleResendConfirmation = async (bookingId: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Confirmation email resent successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, icon: CheckCircle, label: "Completed" },
      pending: { variant: "secondary" as const, icon: Clock, label: "Pending" },
      failed: { variant: "destructive" as const, icon: AlertTriangle, label: "Failed" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payment Dashboard</h1>
            <p className="text-muted-foreground">Manage payments and bookings</p>
          </div>
          <Button onClick={loadDashboardData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue, 'EUR')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.failedPayments}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Recent Payments</TabsTrigger>
            <TabsTrigger value="refunds">Process Refund</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Latest 50 payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-xs">
                          {payment.nexi_transaction_id}
                        </TableCell>
                        <TableCell>{payment.bookings?.vehicle_name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.payer_name}</div>
                            <div className="text-sm text-muted-foreground">{payment.payer_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.payment_status)}
                        </TableCell>
                        <TableCell>{formatDate(payment.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {payment.payment_status === 'completed' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedPayment(payment)}
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResendConfirmation(payment.booking_id)}
                                >
                                  <Mail className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Process Refund</CardTitle>
                <CardDescription>
                  Issue partial or full refunds for completed payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPayment ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Selected Payment</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <p className="font-mono">{selectedPayment.nexi_transaction_id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p className="font-medium">
                            {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Customer:</span>
                          <p>{selectedPayment.payer_name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vehicle:</span>
                          <p>{selectedPayment.bookings?.vehicle_name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="refund-amount">Refund Amount (cents)</Label>
                        <Input
                          id="refund-amount"
                          type="number"
                          max={selectedPayment.amount}
                          value={refundRequest.amount}
                          onChange={(e) => setRefundRequest(prev => ({
                            ...prev,
                            amount: parseInt(e.target.value) || 0
                          }))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Max: {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="refund-reason">Reason</Label>
                        <Input
                          id="refund-reason"
                          placeholder="Reason for refund"
                          value={refundRequest.reason}
                          onChange={(e) => setRefundRequest(prev => ({
                            ...prev,
                            reason: e.target.value
                          }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleRefund}>
                        Process Refund
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Select a completed payment from the table above to process a refund.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}