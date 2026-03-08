import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CreditCard className="w-6 h-6 text-primary" />
                Refund & Cancellation Policy
              </CardTitle>
              <CardDescription>Last updated: March 7, 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Subscription Plans</h3>
                <p className="text-sm text-muted-foreground">Linkedbot may offer monthly subscription plans, one-time purchase plans, and promotional or discounted plans. Pricing and features may change at the discretion of Bhatnagar Digital Labs.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Refund Policy</h3>
                <p className="text-sm text-muted-foreground mb-2">Because Linkedbot provides digital software services, refunds are generally limited.</p>
                <p className="text-sm font-medium text-foreground mb-1">Eligible Refund Requests:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Request made within 7 days of purchase, and service has not been extensively used</li>
                  <li>• A technical issue prevents proper use and cannot be resolved by our support team</li>
                </ul>
                <p className="text-sm font-medium text-foreground mt-3 mb-1">Refunds will NOT be provided if:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• The subscription has been used extensively</li>
                  <li>• Request is made after the refund eligibility period</li>
                  <li>• Purchase was made during special promotions or discounted offers</li>
                  <li>• The user violates Terms & Conditions</li>
                  <li>• Service is suspended due to misuse or fraudulent activity</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Subscription Cancellation</h3>
                <p className="text-sm text-muted-foreground">Users may cancel their subscription at any time. The subscription remains active until the end of the current billing cycle. No further billing will occur after cancellation. We do not provide partial refunds for unused time.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Automatic Renewals</h3>
                <p className="text-sm text-muted-foreground">Recurring subscriptions automatically renew unless cancelled before the renewal date. Users are responsible for cancelling before the next billing cycle.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Payment Processing</h3>
                <p className="text-sm text-muted-foreground">All payments are processed through secure third-party payment providers. Linkedbot does not store full payment card information.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Chargebacks and Abuse</h3>
                <p className="text-sm text-muted-foreground">If a payment dispute or chargeback is initiated, the associated account may be temporarily suspended. Users who initiate fraudulent chargebacks may have their accounts permanently suspended.</p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  For refund requests, contact: <a href="mailto:Team@linkedbot.online" className="text-primary hover:underline">Team@linkedbot.online</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
