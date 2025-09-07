import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Check, Crown, Zap, Infinity } from 'lucide-react'

export default function Subscription() {
  const { state } = useApp()
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: 'Basic',
      icon: Zap,
      description: 'Perfect for individuals and small projects',
      monthlyPrice: 29,
      yearlyPrice: 290,
      videos: 10,
      features: [
        '10 videos per month',
        'Basic templates',
        'Brand asset upload',
        'HD video export',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      icon: Crown,
      description: 'Best for businesses and content creators',
      monthlyPrice: 99,
      yearlyPrice: 990,
      videos: 50,
      features: [
        '50 videos per month',
        'Premium templates',
        'Advanced brand controls',
        '4K video export',
        'Custom layouts',
        'Priority support',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      name: 'Premium',
      icon: Infinity,
      description: 'For agencies and high-volume users',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      videos: 'Unlimited',
      features: [
        'Unlimited videos',
        'Custom templates',
        'White-label options',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics'
      ],
      popular: false
    }
  ]

  const getCurrentPlan = () => {
    return plans.find(plan => plan.name === state.user.subscriptionTier) || plans[1]
  }

  const handleUpgrade = (planName) => {
    // In a real app, this would integrate with Stripe
    alert(`Upgrading to ${planName} plan... (Demo only)`)
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-base font-normal leading-7 text-gray-600 max-w-2xl mx-auto mb-8">
            Automate your video creation with AI. Select the plan that fits your needs 
            and start generating professional branded videos today.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-accent text-white px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Current Plan: {state.user.subscriptionTier}</h3>
              <p className="text-blue-100">
                You're currently on the {state.user.subscriptionTier} plan. 
                {getCurrentPlan().videos === 'Unlimited' 
                  ? ' Enjoy unlimited video generation!'
                  : ` You can create ${getCurrentPlan().videos} videos this month.`
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{getCurrentPlan().videos}</div>
                <div className="text-sm text-blue-100">
                  {getCurrentPlan().videos === 'Unlimited' ? 'Videos' : 'Videos/month'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
            const isCurrentPlan = plan.name === state.user.subscriptionTier

            return (
              <div
                key={plan.name}
                className={`relative bg-surface rounded-lg shadow-card p-8 ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Icon className={`h-12 w-12 mx-auto mb-4 ${
                    plan.popular ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-accent font-medium">
                      Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice} per year
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <div className="text-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {plan.videos} video{plan.videos !== 1 && plan.videos !== 'Unlimited' ? 's' : ''}
                    </span>
                    {plan.videos !== 'Unlimited' && (
                      <span className="text-gray-600"> per month</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-accent mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-surface rounded-lg shadow-card p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What happens to unused videos?</h4>
              <p className="text-sm text-gray-600">
                Unused video credits don't roll over to the next month. We recommend choosing a plan 
                that matches your typical monthly usage.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-gray-600">
                We offer a 30-day money-back guarantee for new subscriptions. Contact our support team 
                if you're not satisfied with the service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-sm text-gray-600">
                New users get 3 free video generations to try our service. No credit card required 
                to get started with the trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}