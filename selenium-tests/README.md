# Selenium Automated Testing - Section E

## Overview
This folder contains Selenium automated tests for the University Finder application deployed on Azure AKS.

**DevOps Lab - Section E: Selenium Automated Testing (6 Marks)**

---

## Test Cases

### Test Case 1: Homepage Load Verification ✅
**Objective:** Verify the application homepage loads successfully

**Steps:**
1. Navigate to frontend URL
2. Check page title is not empty
3. Verify page loads within acceptable time (< 15 seconds)
4. Check page content length
5. Verify university-related content exists

**Expected Result:** Homepage loads successfully with content

---

### Test Case 2: Login Form Validation ✅
**Objective:** Validate login page loads and contains required form elements

**Steps:**
1. Navigate to login page
2. Verify URL contains 'login' or 'signin'
3. Check for email/username input field
4. Check for password input field
5. Verify submit button exists

**Expected Result:** Login page loads with all required form elements

---

### Test Case 3: Backend API Response Check ✅
**Objective:** Verify backend API is accessible and returns data

**Steps:**
1. Send GET request to backend API endpoint
2. Verify response status code is 200
3. Check response contains data
4. Validate JSON structure
5. Navigate to frontend page that uses API

**Expected Result:** Backend API responds successfully with data

---

## Prerequisites

### 1. Install Python
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

This installs:
- `selenium` - Web automation framework
- `webdriver-manager` - Automatic ChromeDriver management
- `requests` - HTTP library for API testing

---

## Running the Tests

### Run All Tests
```bash
cd selenium-tests
python test_university_app.py
```

### Expected Output
```
======================================================================
SELENIUM AUTOMATED TESTING SUITE
University Finder Application - DevOps Lab Section E
======================================================================

Frontend URL: http://4.213.223.12
Backend URL: http://135.235.246.98:5000

🔧 Setting up Chrome WebDriver...
✅ WebDriver setup complete

======================================================================
TEST CASE 1: Homepage Load Verification
======================================================================
📍 Navigating to: http://4.213.223.12
📸 Screenshot saved: selenium-tests/screenshots/01_homepage.png
✅ Page Title: University Finder
✅ Page Load Time: 2.45 seconds
✅ Page Content Length: 15234 bytes
✅ University-related content found

✅ TEST 1 PASSED: Homepage loads successfully

======================================================================
TEST CASE 2: Login Form Validation
======================================================================
📍 Navigating to: http://4.213.223.12/login
📸 Screenshot saved: selenium-tests/screenshots/02_login_page.png
✅ Current URL: http://4.213.223.12/login
✅ Email/Username field found
✅ Password field found
✅ Submit button found

✅ TEST 2 PASSED: Login form validated successfully

======================================================================
TEST CASE 3: Backend API Response Check
======================================================================
📍 Testing API: http://135.235.246.98:5000/api/universities
✅ API Status Code: 200
✅ API returned data
✅ Universities Count: 227
✅ Sample University: NUST

📍 Navigating to: http://4.213.223.12/company/hero-section
📸 Screenshot saved: selenium-tests/screenshots/03_api_response.png
✅ Frontend page loaded with API data

✅ TEST 3 PASSED: Backend API response validated

======================================================================
TEST EXECUTION SUMMARY
======================================================================

📊 Total Tests: 3
✅ Passed: 3
❌ Failed: 0
📈 Success Rate: 100.0%

📄 Report saved to: selenium-tests/test-report.txt
```

---

## Generated Files

After running tests, you'll find:

### 1. Screenshots (in `screenshots/` folder):
- `01_homepage.png` - Homepage screenshot
- `02_login_page.png` - Login page screenshot
- `03_api_response.png` - API connectivity screenshot

### 2. Test Report:
- `test-report.txt` - Detailed test execution report

---

## Folder Structure

```
selenium-tests/
├── test_university_app.py    # Main test script
├── requirements.txt           # Python dependencies
├── README.md                  # This file
├── screenshots/               # Test screenshots
│   ├── 01_homepage.png
│   ├── 02_login_page.png
│   └── 03_api_response.png
└── test-report.txt           # Test execution report
```

---

## Configuration

To test against different URLs, update these variables in `test_university_app.py`:

```python
FRONTEND_URL = "http://4.213.223.12"      # Your frontend URL
BACKEND_URL = "http://135.235.246.98:5000"  # Your backend URL
```

---

## Troubleshooting

### Issue: ChromeDriver not found
**Solution:** The script uses `webdriver-manager` which automatically downloads ChromeDriver. Ensure you have internet connection.

### Issue: Tests fail with timeout
**Solution:** Check if application is running:
```bash
# Check frontend
curl http://4.213.223.12

# Check backend
curl http://135.235.246.98:5000/api/universities
```

### Issue: Screenshots not saved
**Solution:** Create screenshots folder manually:
```bash
mkdir selenium-tests/screenshots
```

---

## Submission Files for Section E

Include these files in your submission:

1. ✅ **test_university_app.py** - Test script
2. ✅ **requirements.txt** - Dependencies
3. ✅ **test-report.txt** - Test execution report
4. ✅ **Screenshots** - All 3 screenshots from `screenshots/` folder
5. ✅ **README.md** - This documentation
6. ✅ **Screenshot of test run** - Terminal output showing all tests passed

---

## Notes

- Tests run in **headless mode** (no browser window)
- Each test is **independent**
- Tests include **automatic screenshots**
- **Simple and clear** test cases as per Section E requirements
- All tests use **explicit waits** for reliability

---

**Author:** DevOps Lab Project  
**Section:** E - Selenium Automated Testing  
**Date:** December 2025
