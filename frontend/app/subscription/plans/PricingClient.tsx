"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { getStoredAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { CountrySelector } from "@/components/locale/CountrySelector";
import { useI18n } from "@/lib/i18n";
import {
  Check,
  Star,
  Zap,
  Crown,
  Building,
  BarChart3,
  Brain,
  Code,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { PricingData } from "@/lib/marketing";

const planIcons = {
  Starter: Star,
  Growth: Zap,
  Scale: Building,
  Enterprise: Crown
};

export default function PricingClient({ data }: { data: PricingData }) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { formatCurrency } = useLocale();
  const { t } = useI18n();

  useEffect(() => {
    const auth = getStoredAuth();
    setIsAuthenticated(!!auth);
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/subscription/plans&plan=${planId}`);
      return;
    }
    router.push(`/dashboard?upgrade=${planId}`);
  };

  const formatLimit = (limit: number | string) => {
    if (limit === -1) return "Unlimited";
    if (typeof limit === "string") return limit;
    return limit.toLocaleString();
  };

  const getSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const monthlyTotal = monthly * 12;
    return Math.round(((monthlyTotal - yearly) / monthlyTotal) * 100);
  };

  const priceForCycle = (monthly: number, yearly: number) =>
    billingCycle === "monthly" ? monthly : yearly;

  const formatPrice = (monthly: number, yearly?: number) =>
    formatCurrency(billingCycle === "monthly" ? monthly : yearly ?? monthly * 10);

  return (
    <div className="page-transition min-h-screen bg-white text-black">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_70%)] blur-3xl" />
      </div>
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <Logo showText />
            <CountrySelector />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="text-center mt-4">
          <h1 className="mb-4 text-4xl font-semibold text-black md:text-5xl">
            {t("nav_pricing")}
          </h1>
          <p className="mb-8 text-lg text-black/70 md:text-xl">
            Scale your export business with our comprehensive platform
          </p>

          {/* Billing Toggle */}
          <div className="mb-8 inline-flex items-center rounded-xl border border-black/10 bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-black text-white shadow-sm"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                billingCycle === "yearly"
                  ? "bg-black text-white shadow-sm"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Yearly
              <Badge className="absolute -right-2 -top-2 bg-black text-white text-xs">
                Save up to 25%
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.plans.map((plan) => {
            const Icon = planIcons[plan.name as keyof typeof planIcons] || Star;
            const price = priceForCycle(plan.monthly, plan.yearly);
            const savings = getSavings(plan.monthly, plan.yearly);

            return (
              <Card
                key={plan.name}
                className={`glass-card relative overflow-hidden border border-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.2)] ${
                  plan.featured
                    ? "scale-[1.02] ring-1 ring-black/20 shadow-lg"
                    : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute left-0 right-0 top-0 bg-black py-2 text-center text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}

                <div className="p-6 pt-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-black/10">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="mb-2 text-2xl font-semibold text-black">
                      {plan.name}
                    </h3>
                    <p className="mb-4 text-sm text-black/60">
                      {plan.tagline}
                    </p>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-semibold text-black">
                          {formatCurrency(price)}
                        </span>
                        <span className="ml-2 text-black/60">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && savings > 0 && (
                        <div className="mt-1 text-sm font-medium text-black/70">
                          Save {savings}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Limits */}
                  <div className="space-y-3 mb-6">
                    {Object.entries(plan.limits).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-black/60">{key.replace(/_/g, " ")}:</span>
                        <span className="font-medium">{formatLimit(value)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 flex-shrink-0 text-black" />
                        <span className="text-black">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full ${
                      plan.featured
                        ? "bg-black text-white hover:bg-black/90"
                        : ""
                    }`}
                    variant={plan.featured ? "primary" : "secondary"}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bundle Offers */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="mb-3 text-3xl font-semibold text-black">
              Best-Selling Bundles
            </h2>
            <p className="text-black/60">
              Curated app combinations with automatic discounts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.bundles.map((bundle) => (
              <Card key={bundle.bundle_id} className="glass-card border border-black/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{bundle.name}</h3>
                    <p className="text-sm text-black/60">{bundle.description}</p>
                  </div>
                  <Badge className="bg-black text-white text-xs">{bundle.highlight}</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-semibold text-black">
                    {formatPrice(bundle.monthly)}
                  </span>
                    <span className="text-sm text-black/50">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                <Button className="w-full" onClick={() => handleSelectPlan(bundle.bundle_id)}>
                  Choose Bundle
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* App Pricing */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="mb-3 text-3xl font-semibold text-black">
              Plans for Every App
            </h2>
            <p className="text-black/60">
              Start with one app and scale up anytime
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.apps.map((app) => (
              <Card key={app.app_id} className="glass-card border border-black/10 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black">{app.name}</h3>
                      <p className="text-sm text-black/60">{app.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-black/10 text-black/70 text-xs">Per App</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {app.tiers.map((tier) => (
                    <div key={tier.name} className="rounded-lg border border-black/10 bg-white p-4">
                      <p className="text-sm font-semibold text-black">{tier.name}</p>
                      <p className="mb-2 text-xs text-black/50">{tier.description}</p>
                      <p className="text-2xl font-semibold text-black">
                        {formatPrice(tier.monthly)}
                      </p>
                      <p className="text-xs text-black/50">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {app.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium text-black/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flagship Apps Section */}
        <div className="mt-16">
          <Card className="glass-card border border-black/10 bg-white">
            <div className="p-8">
              <div className="text-center mb-8">
                <Crown className="mx-auto mb-4 h-12 w-12 text-black" />
                <h2 className="mb-4 text-3xl font-semibold text-black">
                  Flagship Applications
                </h2>
                <p className="text-xl text-black/60">
                  Exclusive AI-powered tools for Flagship subscribers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <Brain className="mx-auto mb-3 h-8 w-8 text-black" />
                  <h3 className="mb-2 font-semibold text-black">AI Insights Engine</h3>
                  <p className="text-sm text-black/60">
                    Predictive analytics, demand forecasting, and intelligent recommendations
                  </p>
                </div>
                <div className="text-center">
                  <BarChart3 className="mx-auto mb-3 h-8 w-8 text-black" />
                  <h3 className="mb-2 font-semibold text-black">Advanced Analytics</h3>
                  <p className="text-sm text-black/60">
                    Custom dashboards, real-time KPIs, and comprehensive reporting
                  </p>
                </div>
                <div className="text-center">
                  <Code className="mx-auto mb-3 h-8 w-8 text-black" />
                  <h3 className="mb-2 font-semibold text-black">Developer Platform</h3>
                  <p className="text-sm text-black/60">
                    Full API access, webhooks, and custom integrations
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="mb-4 text-3xl font-semibold text-black">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border border-black/10 p-6">
              <h3 className="mb-2 font-semibold text-black">
                Can I change plans anytime?
              </h3>
              <p className="text-sm text-black/60">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </Card>

            <Card className="glass-card border border-black/10 p-6">
              <h3 className="mb-2 font-semibold text-black">
                Is there a free trial?
              </h3>
              <p className="text-sm text-black/60">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </Card>

            <Card className="glass-card border border-black/10 p-6">
              <h3 className="mb-2 font-semibold text-black">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-black/60">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </Card>

            <Card className="glass-card border border-black/10 p-6">
              <h3 className="mb-2 font-semibold text-black">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-black/60">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="rounded-3xl bg-black p-8 text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Scale Your Export Business?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of exporters who trust MnD Business Suite
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-black hover:bg-white/90"
                onClick={() => router.push("/contact")}
              >
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/40 bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.push("/demo")}
              >
                Schedule Demo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
