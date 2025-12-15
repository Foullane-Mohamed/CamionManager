# Quick Testing Guide - Chauffeur Dashboard

## 🚀 Quick Start

### 1. Start the Application

```powershell
cd c:\Users\pc\Desktop\CamionManager\frontend
npm run dev
```

### 2. Login as Chauffeur

- Navigate to login page
- Use chauffeur credentials
- Should redirect to dashboard

---

## ✅ Testing Steps

### Phase 1: Dashboard Load (2 minutes)

1. **Check Dashboard Loads**

   - [ ] Dashboard appears without errors
   - [ ] Purple gradient header visible
   - [ ] "My Trips" title displayed
   - [ ] Welcome message shows driver name
   - [ ] Refresh button visible

2. **Check Trip Display**
   - [ ] Trips assigned to driver shown
   - [ ] OR empty state message if no trips
   - [ ] Trip cards have proper styling
   - [ ] Dark mode toggle works

### Phase 2: Trip Information (3 minutes)

3. **Verify Trip Card Content**
   - [ ] Trip number/ID visible
   - [ ] Status badge shows (À faire/En cours/Terminé)
   - [ ] Status has correct color (Yellow/Blue/Green)
   - [ ] Status icon visible
   - [ ] Start point with green pin icon
   - [ ] Destination with red pin icon
   - [ ] Departure date formatted correctly
   - [ ] Arrival date formatted correctly
   - [ ] Truck matricule displayed
   - [ ] Mileage information shown
   - [ ] Remarks section (if available)

### Phase 3: Status Updates (5 minutes)

4. **Test Status Transition: À faire → En cours**

   - [ ] Find trip with status "À faire"
   - [ ] "Start Trip" button visible and blue
   - [ ] Click "Start Trip"
   - [ ] Loading spinner appears
   - [ ] Success toast notification
   - [ ] Status changes to "En cours"
   - [ ] Button changes to "Complete Trip"

5. **Test Status Transition: En cours → Terminé**
   - [ ] Find trip with status "En cours"
   - [ ] "Complete Trip" button visible and green
   - [ ] Click "Complete Trip"
   - [ ] Loading spinner appears
   - [ ] Success toast notification
   - [ ] Status changes to "Terminé"
   - [ ] Action buttons update

### Phase 4: PDF Download (5 minutes)

6. **Test PDF Generation**
   - [ ] Click "Mission Order" button
   - [ ] Button shows loading spinner
   - [ ] Button disabled during download
   - [ ] Text changes to "Downloading..."
   - [ ] PDF file downloads automatically
   - [ ] File named `mission-order-{id}.pdf`
   - [ ] Success toast appears
   - [ ] OR error message if backend not ready

### Phase 5: Navigation (3 minutes)

7. **Test View Details**

   - [ ] Click "View Details" button
   - [ ] Navigates to trip view page
   - [ ] Trip information displayed
   - [ ] Can navigate back to dashboard

8. **Test Update Info**
   - [ ] Click "Update Info" button
   - [ ] Navigates to trip edit page
   - [ ] Form loads with trip data
   - [ ] Can edit mileage
   - [ ] Can edit remarks
   - [ ] Save works correctly

### Phase 6: Edit Pages (10 minutes)

9. **Test MaintenanceEdit**

   - [ ] Navigate to Maintenance list
   - [ ] Click edit on any record
   - [ ] Page loads WITHOUT "failed to load" error
   - [ ] Form populated with data
   - [ ] Can modify fields
   - [ ] Save button works
   - [ ] Success notification

10. **Test FuelEdit**

    - [ ] Navigate to Fuel list
    - [ ] Click edit on any record
    - [ ] Page loads WITHOUT "failed to load" error
    - [ ] Form populated with data
    - [ ] Can modify fields
    - [ ] Save works

11. **Test TripEdit**

    - [ ] Navigate to Trip list
    - [ ] Click edit on any record
    - [ ] Page loads WITHOUT "failed to load" error
    - [ ] Form populated with data
    - [ ] Can modify allowed fields
    - [ ] Save works

12. **Test TireEdit**
    - [ ] Navigate to Tire list
    - [ ] Click edit on any record
    - [ ] Page loads WITHOUT "failed to load" error
    - [ ] Form populated with data
    - [ ] Can modify fields
    - [ ] Save works

---

## 🐛 Error Scenarios to Test

### PDF Download Errors

**Test 1: Backend Not Implemented**

- Expected: Toast message "Failed to download PDF. Feature may not be available yet."
- Check console for error details

**Test 2: Trip Not Found (404)**

- Delete trip, try to download PDF
- Expected: Toast message "PDF generation endpoint not found"

**Test 3: Server Error (500)**

- Simulate server error on backend
- Expected: Toast message "Server error while generating PDF"

### Status Update Errors

**Test 4: Invalid Status Transition**

- Try to update completed trip
- Expected: Error toast with message

**Test 5: Network Error**

- Disconnect network, try to update
- Expected: Error toast with network error message

### Edit Page Errors

**Test 6: Invalid Data**

- Try to save with invalid values
- Expected: Validation errors shown
- Form should not submit

**Test 7: Missing Required Fields**

- Clear required field, try to save
- Expected: Validation error for required field

---

## 🎨 Visual Checks

### Light Mode

- [ ] All text readable
- [ ] Icons visible
- [ ] Cards have proper shadows
- [ ] Buttons have correct colors
- [ ] No contrast issues

### Dark Mode

- [ ] Toggle to dark mode
- [ ] Background changes to dark
- [ ] All text remains readable
- [ ] Icons visible in dark mode
- [ ] Buttons still visible
- [ ] Status badges readable
- [ ] No "white flash" issues

### Responsive Design

- [ ] Desktop view (1920x1080)
- [ ] Laptop view (1366x768)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)
- [ ] Cards stack properly on mobile
- [ ] Buttons accessible on mobile

---

## 📊 Test Results Template

### Session Information

- **Date**: ******\_\_\_******
- **Tester**: ******\_\_\_******
- **Browser**: ******\_\_\_******
- **Screen Size**: ******\_\_\_******
- **Role**: Chauffeur / Admin

### Results Summary

- **Total Tests**: 12
- **Passed**: **\_**
- **Failed**: **\_**
- **Blocked**: **\_**

### Failed Tests (if any)

1. Test #**\_ - Issue: ******\_********
2. Test #**\_ - Issue: ******\_********

### Browser Console Errors

```
[Paste any console errors here]
```

### Screenshots

- [ ] Dashboard view
- [ ] Trip card detail
- [ ] PDF download
- [ ] Edit page
- [ ] Dark mode
- [ ] Any errors

---

## 🔧 Troubleshooting

### Issue: Dashboard is blank

**Solution**:

1. Check browser console for errors
2. Verify user role is "chauffeur"
3. Check if trips are assigned to user
4. Verify API is responding

### Issue: PDF won't download

**Solution**:

1. Check backend has PDF endpoint implemented
2. Verify trip exists in database
3. Check browser allows downloads
4. Check console for specific error

### Issue: Status update doesn't work

**Solution**:

1. Check user has permission
2. Verify trip exists
3. Check status transition is valid
4. Check backend validates status changes

### Issue: Edit page shows "failed to load"

**Solution**:

1. Check browser console for error details
2. Verify API response structure
3. Check validation schema matches
4. Verify item exists in database

---

## 📞 Quick Commands

### Check Build

```powershell
cd c:\Users\pc\Desktop\CamionManager\frontend
npm run build
```

### Run Dev Server

```powershell
npm run dev
```

### Check for Errors

```powershell
npm run lint
```

### Clear Cache

```powershell
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

---

## ✨ Success Indicators

Your implementation is working correctly if:

1. ✅ No "failed to load" errors on any edit page
2. ✅ Dashboard loads and shows trips for chauffeur
3. ✅ Status updates work and show success message
4. ✅ PDF download button triggers download (or shows clear error if not implemented)
5. ✅ Navigation works between pages
6. ✅ Dark mode works throughout
7. ✅ No console errors (except expected backend errors)
8. ✅ Build completes successfully

---

## 🎯 Priority Issues

If something doesn't work, fix in this order:

1. **Critical**: Edit pages not loading
2. **High**: Dashboard not showing trips
3. **High**: Status updates not working
4. **Medium**: PDF download not working (may be backend)
5. **Low**: Styling issues
6. **Low**: Dark mode glitches

---

_Testing Time: ~30 minutes for full suite_
_Quick Test: ~10 minutes for basic functionality_
