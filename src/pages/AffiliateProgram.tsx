import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Share2, CheckCircle2 } from "lucide-react";

const AffiliateProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Affiliate Program</Badge>
            <h1 className="text-4xl font-bold mb-4">Linkedbot Affiliate Partner Agreement</h1>
            <p className="text-muted-foreground text-lg">
              Earn commissions by referring users to Linkedbot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Share2 className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">Get your unique referral link and share with your network</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Users Sign Up</h3>
                <p className="text-sm text-muted-foreground">When users sign up through your link and subscribe</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Earn Commission</h3>
                <p className="text-sm text-muted-foreground">Receive commission on every successful referral</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Affiliate Partner Agreement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Eligibility</h3>
                <p className="text-sm text-muted-foreground">Anyone can apply to become a Linkedbot affiliate. Approval is at the discretion of Bhatnagar Digital Labs. We reserve the right to reject or terminate any affiliate account.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Commission Structure</h3>
                <p className="text-sm text-muted-foreground">Affiliates earn a commission on qualifying paid subscriptions referred through their unique affiliate link. Commission rates and payment terms will be communicated upon approval.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Prohibited Activities</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Self-referrals or creating fake accounts</li>
                  <li>• Misleading advertising or spam</li>
                  <li>• Bidding on "Linkedbot" branded keywords in paid ads</li>
                  <li>• Any form of fraudulent or deceptive practices</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Payment</h3>
                <p className="text-sm text-muted-foreground">Commissions are paid monthly for verified referrals. Minimum payout threshold and payment method will be specified upon acceptance into the program.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Termination</h3>
                <p className="text-sm text-muted-foreground">Either party may terminate the affiliate relationship at any time. Unpaid commissions for verified referrals will still be honored. Violation of terms results in immediate termination and forfeiture of pending commissions.</p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  By joining the Linkedbot Affiliate Program, you agree to this Affiliate Partner Agreement.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact: <a href="mailto:Team@linkedbot.online" className="text-primary hover:underline">Team@linkedbot.online</a>
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

export default AffiliateProgram;
