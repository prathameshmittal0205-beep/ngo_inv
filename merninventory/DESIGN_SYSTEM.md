# Community Resource Management System - Design System

This design system establishes a trustworthy, clean, and accessible visual language tailored for an NGO/Community-focused application. It moves away from "corporate-SaaS" purples and bright electric colors in favor of grounding greens, trustworthy blues, and soft, readable neutrals.

## 🎨 1. Color Palette

### Core Colors
* **Primary (Trust & Growth):** `var(--color-primary)` - **#2E7D32** (Forest Green)
  * *Hover State:* `#1B5E20` (Deep Green)
  * *Usage:* Primary actions, main navigation branding, active states.
* **Secondary (Community & Calm):** `var(--color-secondary)` - **#1976D2** (Ocean Blue)
  * *Hover State:* `#1565C0`
  * *Usage:* Secondary buttons, informative highlights, secondary links.

### Neutrals (Backgrounds & Text)
* **Background:** `var(--color-bg)` - **#F4F7F6** (Soft cool off-white)
  * *Dark Mode (`var(--color-bg-dark)`):* `#121212`
  * *Usage:* Main application background to reduce eye strain.
* **Surface:** `var(--color-surface)` - **#FFFFFF** (Pure White)
  * *Dark Mode (`var(--color-surface-dark)`):* `#1E1E1E`
  * *Usage:* Cards, modals, dropdowns (areas that need to "pop" off the background).
* **Text Main:** `var(--color-text-main)` - **#212529** (Dark Slate)
  * *Dark Mode (`var(--color-text-main-dark)`):* `#F8F9FA`
  * *Usage:* Body text, headings.
* **Text Muted:** `var(--color-text-muted)` - **#6C757D** (Medium Gray)
  * *Dark Mode (`var(--color-text-muted-dark)`):* `#ADB5BD`
  * *Usage:* Table headers, placeholder text, secondary labels.

### Semantic/Feedback Colors
* **Success (In Stock/Approved):** `var(--color-success)` - **#388E3C**
* **Warning (Low Stock/Pending):** `var(--color-warning)` - **#F57C00**
* **Danger (Out of Stock/Delete):** `var(--color-danger)` - **#D32F2F**

---

## 🔤 2. Typography Scale

* **Font Family:** `'Inter', system-ui, sans-serif;` (Clean, modern, highly legible)

| Type | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display H1** | 2.5rem (40px) | Bold (700) | Public-facing landing pages |
| **App H1** | 1.75rem (28px) | Bold (700) | Internal page titles (e.g., "Manage Requests") |
| **H2** | 1.5rem (24px) | Semi-bold (600) | Section Headers |
| **H3** | 1.25rem (20px) | Medium (500) | Card Titles, Modal Headers |
| **Body** | 1.0rem (16px) | Regular (400) | Standard paragraph and table cell text |
| **Label** | 0.875rem (14px)| Medium (500) | Table headers, form labels, small buttons |
| **Tiny** | 0.75rem (12px) | Bold (700) | Status badges (uppercase) |

---

## 🃏 3. Card & Surface Style

Cards are used to group related information (like dashboard stats or form wrappers). They should feel light and clearly separated from the background without being overly heavy.

* **Background:** `#FFFFFF`
* **Border Radius:** `8px` (Soft but structured)
* **Box Shadow:** `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)` (A subtle, gentle float)
* **Border (Optional):** `1px solid #E5E7EB` (Used only if the background is also white)
* **Padding:** `24px` (`1.5rem`) internally for breathing room.

---

## 🖱️ 4. Button Styles

Buttons should have clear affordances and smooth hover transitions (`transition: all 0.2s ease;`).

* **Base Styles:** Border radius `6px`, padding `8px 16px`, font weight `500`.

* **Primary Button:**
  * Background: `#2E7D32`
  * Text: `#FFFFFF`
  * Border: None
  * Hover: Background darkens to `#1B5E20`, slight drop shadow.

* **Secondary/Outline Button:**
  * Background: Transparent
  * Text: `#1976D2`
  * Border: `1px solid #1976D2`
  * Hover: Background fills lightly with `#E3F2FD`.

* **Danger Button:**
  * Background: `#D32F2F`
  * Text: `#FFFFFF`
  * Border: None
  * Hover: Background darkens to `#B71C1C`.

---

## 🏷️ 5. Stock & Status Indicators (Badges)

Used in tables and lists to immediately communicate the state of an item. These use "soft" pastel backgrounds with "hard" dark text for maximum readability and a modern aesthetic.

* **Base Badge Style:**
  * Border radius: `9999px` (Pill shape)
  * Padding: `4px 12px`
  * Font: `0.75rem` (12px), `Bold`, uppercase tracking.

* **🟢 Good / In Stock / Active:**
  * Background: `#E8F5E9` (Light Green)
  * Text: `#2E7D32` (Dark Green)

* **🟠 Warning / Low Stock / Pending:**
  * Background: `#FFF3E0` (Light Orange)
  * Text: `#E65100` (Dark Orange)

* **🔴 Critical / Out of Stock / Rejected:**
  * Background: `#FFEBEE` (Light Red)
  * Text: `#C62828` (Dark Red)
