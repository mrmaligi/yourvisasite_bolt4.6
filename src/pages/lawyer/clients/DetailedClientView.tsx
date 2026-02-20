import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Calendar, FileText, MessageSquare, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchClientDetails = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+61 400 123 456',
    address: '123 Pitt St, Sydney NSW 2000',
    status: 'active',
    visaType: 'Partner Visa (820/801)',
    nextStep: 'Submit Police Check',
    lastContact: '2 days ago',
    cases: [
      { id: 'c1', title: 'Partner Visa Application', status: 'in_progress', startDate: '2023-10-01' },
    ],
    documents: [
      { id: 'd1', name: 'Passport.pdf', date: '2023-10-05' },
      { id: 'd2', name: 'Relationship Statement.docx', date: '2023-10-10' },
    ],
  };
};

export const DetailedClientView = () => {
  const { data: client, isLoading } = useQuery({
    queryKey: ['lawyer-client-detail'],
    queryFn: fetchClientDetails,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
            {client?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{client?.name}</h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Badge variant="success">Active Client</Badge>
              <span>•</span>
              <span>Client since {new Date(client?.cases[0].startDate || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Book Meeting
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Contact Info</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${client?.email}`} className="text-primary-600 hover:underline">{client?.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span>{client?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>{client?.address}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Request Document
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Create Invoice
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" /> Log Time
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Active Cases</h2>
            </CardHeader>
            <CardBody>
              {client?.cases.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{c.title}</h3>
                    <p className="text-sm text-neutral-500">Started {new Date(c.startDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="info">In Progress</Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Recent Documents</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {client?.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
