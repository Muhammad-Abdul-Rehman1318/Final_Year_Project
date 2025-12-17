# Selenium Automated Testing - University Finder App

## Overview
This directory contains Selenium automated tests for the University Finder application deployed on Azure AKS.

## Test Cases

### Test 1: Homepage Load Test ✅
**Objective:** Verify the application homepage loads successfully

**Steps:**
1. Navigate to application URL
2. Verify page title is present
3. Check page load time
4. Validate content is displayed

**Expected Result:** Homepage loads within 10 seconds with proper content

---

### Test 2: Login Page Navigation Test ✅
**Objective:** Validate navigation to login page

**Steps:**
1. Navigate to homepage
2. Click on "Sign in" link
3. Verify login page loads
4. Check for login form elements (email, password)

**Expected Result:** Login page loads with form elements

---

### Test 3: Registration Page Test ✅
**Objective:** Validate registration page elements

**Steps:**
1. Navigate to registration page
2. Verify form input fields are present
3. Check for submit button
4. Validate form structure

**Expected Result:** Registration page contains all required form elements

---

### Test 4: Search Functionality Test ✅
**Objective:** Validate university search feature

**Steps:**
1. Navigate to hero section/search page
2. Locate search input field
3. Enter search query ("NUST")
4. Verify search interaction

**Expected Result:** Search functionality is accessible and interactive

---

### Test 5: Backend API Connectivity Test ✅
**Objective:** Check frontend-backend communication

**Steps:**
1. Navigate to page that makes API calls
2. Check browser console for errors
3. Verify page loads data from backend
4. Validate no critical errors

**Expected Result:** Frontend successfully communicates with backend API

---

## Prerequisites

### 1. Install Python (if not already installed)
```bash
python --version
# Should be Python 3.8 or higher
```

### 2. Install Chrome Browser
Download from: https://www.google.com/chrome/

### 3. Install Dependencies
```bash
cd selenium-tests
pip install -r requirements.txt
```

This will install:
- `selenium` - Web automation framework
- `webdriver-manager` - Automatic ChromeDriver management
- `pytest` - Testing framework
- `pytest-html` - HTML report generation

---

## Running the Tests

### Option 1: Run All Tests
```bash
cd selenium-tests
python test_university_finder.py
```

### Option 2: Run with Pytest
```bash
cd selenium-tests
pytest test_university_finder.py -v
```

### Option 3: Run with HTML Report
```bash
cd selenium-tests
pytest test_university_finder.py -v --html=test-report.html --self-contained-html
```

### Option 4: Run Specific Test
```bash
cd selenium-tests
pytest test_university_finder.py::TestUniversityFinderApp::test_01_homepage_loads_successfully -v
```

---

## Expected Output

```
=== Test 1: Homepage Load Test ===
✓ Page Title: University Finder
✓ Page Load Time: 2.34 seconds
✓ Homepage content verified
✅ Test 1 PASSED: Homepage loads successfully

=== Test 2: Login Page Navigation Test ===
✓ Clicked on Sign in link
✓ Current URL: http://4.224.133.62/login
✓ Login form elements present
✅ Test 2 PASSED: Login page navigation successful

=== Test 3: Registration Page Test ===
✓ Current URL: http://4.224.133.62/register
✓ Form elements found: email, password, name
✓ Submit button present
✅ Test 3 PASSED: Registration page elements validated

=== Test 4: Search Functionality Test ===
✓ Search input field found
✓ Search query entered: NUST
✅ Test 4 PASSED: Search functionality validated

=== Test 5: Backend API Connectivity Test ===
✓ Browser logs checked: 12 total logs
✓ No severe errors in console
✓ Page loaded with content from backend
✅ Test 5 PASSED: Backend API connectivity verified

======================== 5 passed in 45.23s ========================
```

---

## Generated Files

After running tests, you'll find:

1. **Screenshots** (in `screenshots/` folder):
   - `01_homepage.png` - Homepage screenshot
   - `02_login_page.png` - Login page screenshot
   - `03_registration_page.png` - Registration page screenshot
   - `04_search_before.png` - Search page before input
   - `04_search_after.png` - Search page after input
   - `05_api_connectivity.png` - API connectivity test screenshot

2. **Test Report**:
   - `test-report.html` - Detailed HTML test report

---

## Troubleshooting

### Issue: ChromeDriver not found
**Solution:** The script uses `webdriver-manager` which automatically downloads ChromeDriver. Just ensure you have internet connection.

### Issue: Tests fail with timeout
**Solution:** Increase wait times in the script or check if application is running:
```bash
# Check if frontend is accessible
curl http://4.224.133.62

# Check if backend is accessible
curl http://98.70.247.91:5000
```

### Issue: Headless mode not working
**Solution:** Remove `--headless` option from Chrome options to see browser window:
```python
# Comment out this line in the script:
# chrome_options.add_argument('--headless')
```

---

## Submission Files

For exam submission, include:

1. ✅ **test_university_finder.py** - Test script
2. ✅ **requirements.txt** - Dependencies
3. ✅ **test-report.html** - Test execution report
4. ✅ **Screenshots** - All 6 screenshots from `screenshots/` folder
5. ✅ **This README.md** - Documentation

---

## Test Execution Screenshots Required

1. **Command line showing test execution**
2. **Test results showing all 5 tests passed**
3. **HTML report opened in browser**
4. **Sample screenshots from tests** (at least 2-3)

---

## Configuration

To test against different URLs, update these variables in `test_university_finder.py`:

```python
APP_URL = "http://4.224.133.62"  # Your frontend URL
BACKEND_URL = "http://98.70.247.91:5000"  # Your backend URL
```

---

## Notes

- Tests run in **headless mode** by default (no browser window)
- Each test is **independent** and can run separately
- Tests include **automatic screenshots** for documentation
- **HTML report** is generated automatically with pytest-html
- All tests use **explicit waits** for better reliability

---

## Author
Muhammad Owais - DevOps Lab Project
Section E: Selenium Automated Testing
