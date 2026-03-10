import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PaymentConfirmationV2() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-8">Your payment of $49.00 has been processed successfully.</p>
          
          <div className="bg-slate-50 p-4 mb-8 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Order ID</span>
              <span className="font-medium">#ORD-2024-001</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Date</span>
              <span className="font-medium">Mar 20, 2024</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Amount</span>
              <span className="font-medium">$49.00</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button variant="primary" className="w-full">
              Access Premium Content
            </Button>
            
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" /> Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
