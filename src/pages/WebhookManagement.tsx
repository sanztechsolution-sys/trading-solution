// Webhook management page

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Copy, Trash2, Activity, CheckCircle2, XCircle } from "lucide-react";

interface Webhook {
  id: string;
  name: string;
  urlPath: string;
  isActive: boolean;
  createdAt: string;
  signalCount: number;
}

export default function WebhookManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "Gold Scalping Strategy",
      urlPath: "/webhook/wh_abc123xyz",
      isActive: true,
      createdAt: "2024-01-15",
      signalCount: 47,
    },
    {
      id: "2",
      name: "EUR/USD Swing",
      urlPath: "/webhook/wh_def456uvw",
      isActive: true,
      createdAt: "2024-01-14",
      signalCount: 23,
    },
    {
      id: "3",
      name: "BTC Breakout",
      urlPath: "/webhook/wh_ghi789rst",
      isActive: false,
      createdAt: "2024-01-10",
      signalCount: 8,
    },
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState("");

  const baseUrl = "https://5f369da3-2181-4ad2-a5ec-1cd0023b7c37.canvases.tempo.build";

  const handleCreateWebhook = () => {
    if (!newWebhookName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook name",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhookName,
      urlPath: `/webhook/wh_${Math.random().toString(36).substr(2, 9)}`,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      signalCount: 0,
    };

    setWebhooks([...webhooks, newWebhook]);
    setNewWebhookName("");
    setIsCreateDialogOpen(false);

    toast({
      title: "Webhook created",
      description: "Your new webhook is ready to receive signals",
    });
  };

  const handleCopyUrl = (urlPath: string) => {
    const fullUrl = `${baseUrl}${urlPath}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
  };

  const handleToggleActive = (id: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === id ? { ...wh, isActive: !wh.isActive } : wh
    ));
    toast({
      title: "Status updated",
      description: "Webhook status has been changed",
    });
  };

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== id));
    toast({
      title: "Webhook deleted",
      description: "The webhook has been removed",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Webhooks</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Manage your TradingView webhook endpoints
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>
                  Create a new webhook endpoint for your TradingView alerts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Gold Scalping Strategy"
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateWebhook} className="w-full">
                  Create Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-blue-700">
                Total Webhooks
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-blue-900">
                {webhooks.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-green-700">
                Active
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-green-900">
                {webhooks.filter(w => w.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-purple-700">
                Total Signals
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-purple-900">
                {webhooks.reduce((sum, w) => sum + w.signalCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-amber-700">
                Inactive
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-amber-900">
                {webhooks.filter(w => !w.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Webhooks Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Your Webhooks</CardTitle>
            <CardDescription className="text-sm">
              Manage and monitor your webhook endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="lg:hidden space-y-3">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base">{webhook.name}</span>
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
                      {webhook.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <p className="font-mono break-all">{baseUrl}{webhook.urlPath}</p>
                    <p>Signals: {webhook.signalCount}</p>
                    <p>Created: {webhook.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(webhook.urlPath)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(webhook.id)}
                      className="flex-1"
                    >
                      {webhook.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signals</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {webhook.urlPath}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={webhook.isActive ? "default" : "secondary"}>
                          {webhook.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{webhook.signalCount}</TableCell>
                      <TableCell>{webhook.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(webhook.urlPath)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(webhook.id)}
                          >
                            {webhook.isActive ? (
                              <XCircle className="w-4 h-4 text-amber-600" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(webhook.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">TradingView Setup</CardTitle>
            <CardDescription>How to configure your alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-slate-900">Copy your webhook URL</p>
                <p className="text-slate-600">Click the copy button next to your webhook</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-slate-900">Create alert in TradingView</p>
                <p className="text-slate-600">Set your conditions and paste the webhook URL</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-slate-900">Configure the JSON payload</p>
                <p className="text-slate-600">Use the format specified in the documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
