# Historical Data Tracking for New Users - Integration Guide

## Overview

When a new user registers and makes their first deposit, they need historical data for the dashboard sparklines and percentage changes. This guide explains how the system handles new users.

## The Three-Part System

### 1. **Daily Automated Snapshots** (Primary Method)
- **Cron endpoint:** `/api/cron/snapshot-stats`
- **Runs:** Daily (midnight recommended)
- **What it does:** Creates a snapshot for ALL users (including new ones) with their current stats

### 2. **Manual Snapshots** (Real-time Updates)
- **Service:** `snapshot-service.ts`
- **Functions:** `createInitialSnapshot()` and `createUserSnapshot()`
- **When to call:** After significant user activities

### 3. **Dashboard Fallback** (Graceful Degradation)
- **File:** `dashboard/+page.server.ts`
- **What it does:** Uses actual current database values if no historical snapshots exist
- **Result:** New users see their real current values, even without historical data

---

## Integration Points

### ✅ **1. User Registration** (Create Initial Zero Snapshot)

**File:** Your auth/registration handler (e.g., `routes/(auth)/register/+page.server.ts`)

**Add after user creation:**

\`\`\`typescript
import { createInitialSnapshot } from '$lib/server/services/snapshot-service';

// After successfully creating user
const [newUser] = await db.insert(users).values({...}).returning();

// Create initial snapshot (all zeros for new user)
await createInitialSnapshot(newUser.id);
\`\`\`

---

### ✅ **2. Deposit Confirmation** (When Admin Approves)

**File:** Your admin deposit approval handler (e.g., `routes/(app)/admin/deposits/+page.server.ts`)

**Add after wallet balance is credited:**

\`\`\`typescript
import { createUserSnapshot } from '$lib/server/services/snapshot-service';

// After confirming deposit and updating user's wallet balance
await db.update(users)
  .set({ walletBalance: sql\`wallet_balance + \${depositAmount}\` })
  .where(eq(users.id, userId));

// Create snapshot to capture new balance
await createUserSnapshot(userId);
\`\`\`

**Note:** Do NOT create snapshot when user submits deposit (pending status). Only create when admin confirms and credits the wallet.

---

### ✅ **3. Investment Purchase** (When User Buys a Plan)

**File:** `routes/(frontend)/plans/+page.server.ts` (or wherever buyPlan action is)

**Add after investment creation:**

\`\`\`typescript
import { createUserSnapshot } from '$lib/server/services/snapshot-service';

// After successfully creating investment
await db.insert(investments).values({
  userId: user.id,
  planId: planId,
  amount: amount,
  // ... other fields
});

// Update user's wallet balance (deduct investment amount)
await db.update(users)
  .set({ walletBalance: sql\`wallet_balance - \${amount}\` })
  .where(eq(users.id, user.id));

// Create snapshot to capture investment and new balance
await createUserSnapshot(user.id);
\`\`\`

---

### ✅ **4. Withdrawal Approval** (When Admin Approves)

**File:** Your admin withdrawal approval handler

**Add after processing withdrawal:**

\`\`\`typescript
import { createUserSnapshot } from '$lib/server/services/snapshot-service';

// After approving withdrawal (balance already deducted on creation)
await db.update(withdrawals)
  .set({ status: 'approved' })
  .where(eq(withdrawals.id, withdrawalId));

// Create snapshot
const withdrawal = await db.select().from(withdrawals).where(eq(withdrawals.id, withdrawalId)).limit(1);
await createUserSnapshot(withdrawal[0].userId);
\`\`\`

---

## Cron Job Setup

### **Step 1: Set Environment Variable**

Add to your `.env` file:

\`\`\`env
CRON_SECRET=your-secure-random-secret-here
\`\`\`

**Generate a secure secret:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

---

### **Step 2: Configure Cron Job**

#### **Option A: Vercel Cron (Recommended if on Vercel)**

Create `vercel.json` in project root:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/snapshot-stats",
      "schedule": "0 0 * * *"
    }
  ]
}
\`\`\`

This runs daily at midnight UTC.

#### **Option B: External Cron Service**

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

1. Create a new cron job
2. URL: `https://yourdomain.com/api/cron/snapshot-stats`
3. Schedule: `0 0 * * *` (daily at midnight)
4. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

#### **Option C: GitHub Actions**

Create `.github/workflows/daily-snapshot.yml`:

\`\`\`yaml
name: Daily Stats Snapshot
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  snapshot:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Snapshot
        run: |
          curl -X GET \
            -H "Authorization: Bearer \${{ secrets.CRON_SECRET }}" \
            https://yourdomain.com/api/cron/snapshot-stats
\`\`\`

Add `CRON_SECRET` to GitHub repository secrets.

---

### **Step 3: Test the Cron Job**

Test manually:

\`\`\`bash
curl -X GET \
  -H "Authorization: Bearer your-cron-secret-here" \
  https://yourdomain.com/api/cron/snapshot-stats
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "message": "Created X snapshots for Y users",
  "date": "2026-07-06"
}
\`\`\`

---

## How It Works for New Users

### **Day 0: User Registers**
1. User signs up
2. `createInitialSnapshot()` creates first record with zeros
3. Dashboard shows: Balance $0, Investments $0, 0% changes

### **Day 0: User Makes First Deposit (Admin Confirms)**
1. Admin confirms deposit, credits $1000 to wallet
2. `createUserSnapshot()` creates/updates snapshot for today
3. Dashboard shows: Balance $1000, 0% change (no previous data)
4. Sparkline shows single point

### **Day 0: User Buys Investment**
1. User invests $500 in a plan
2. `createUserSnapshot()` updates snapshot for today
3. Dashboard shows: Balance $500, Investment $500, 0% change
4. Sparkline shows single point

### **Day 1-6: Daily Snapshots**
- Cron job runs daily at midnight
- Creates new snapshot for user with updated values
- User now has 2-7 days of data
- Sparkline shows trend line (2-7 points)
- Percentage changes still 0% (not enough data for 7-day comparison)

### **Day 7+: Full Historical Tracking**
- User has 7+ days of data
- Dashboard shows: Real percentage changes (today vs 7 days ago)
- Sparkline shows smooth 7-point trend
- All features working fully

---

## Troubleshooting

### **Issue: New users see empty dashboard**
**Solution:** Make sure `createInitialSnapshot()` is called after registration

### **Issue: Sparklines still empty after activity**
**Solution:** Make sure `createUserSnapshot()` is called after wallet/investment changes

### **Issue: Percentage changes always 0%**
**Solution:** Normal for first 7 days. After 7 days, ensure cron job is running daily

### **Issue: Cron job not running**
**Solution:** Check CRON_SECRET is set correctly and cron schedule is configured

---

## Summary

**For New Users:**
- ✅ Initial snapshot on registration (zeros)
- ✅ Real-time snapshot on each activity (deposit, invest, withdraw)
- ✅ Daily automated snapshot at midnight
- ✅ Dashboard gracefully handles missing data
- ✅ After 7 days: full historical tracking with trends

**Key Files:**
- `/api/cron/snapshot-stats/+server.ts` - Cron endpoint
- `snapshot-service.ts` - Snapshot utility functions
- `dashboard/+page.server.ts` - Handles missing data gracefully
