import { FileText, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function InvoiceDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Billing</span>
            <span>/</span>
            <span className="text-white">INV-001</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">INVOICE</h1>
              <p className="text-slate-500">INV-001</p>
            </div>
            
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700">Paid</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-slate-500">Bill To</p>
              <p className="font-medium text-slate-900">John Doe</p>
              <p className="text-slate-600">john@example.com</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-900">March 15, 2024</p>
              
              <p className="text-sm text-slate-500 mt-4">Due Date</p>
              <p className="font-medium text-slate-900">March 30, 2024</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Description</th>
                <th className="text-right p-3 text-sm font-medium text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3">Partner Visa Consultation</td>
                <td className="p-3 text-right">$500.00</td>
              </tr>
              <tr>
                <td className="p-3">Document Preparation</td>
                <td className="p-3 text-right">$750.00</td>
              </tr>
              <tr>
                <td className="p-3">Application Review</td>
                <td className="p-3 text-right">$250.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td className="p-3 font-semibold">Total</td>
                <td className="p-3 text-right font-bold text-xl">$1,500.00</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            <Button variant="outline">Send to Client</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
