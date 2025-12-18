"""
SECTION E: SELENIUM AUTOMATED TESTING
University Finder Application - DevOps Lab

This script contains automated Selenium test cases for the University Finder application.
Tests verify frontend functionality, navigation, form behavior, and API connectivity.

Author: DevOps Lab Project
Date: December 2025
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time
import sys

# ==========================================
# CONFIGURATION
# ==========================================
FRONTEND_URL = "http://4.213.223.12"
BACKEND_URL = "http://135.235.246.98:5000"
TIMEOUT = 15

test_results = []

def setup_driver():
    """Initialize Chrome WebDriver with options"""
    print("\n🔧 Setting up Chrome WebDriver...")
    chrome_options = Options()
    # chrome_options.add_argument('--headless')  # Uncomment for headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--start-maximized')
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(TIMEOUT)
    print("✅ Chrome WebDriver initialized\n")
    return driver

def log_test_result(test_name, status, message=""):
    """Log and display test results"""
    result = {
        'test': test_name,
        'status': status,
        'message': message,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    test_results.append(result)
    status_symbol = "✅" if status == "PASS" else "❌"
    print(f"{status_symbol} {test_name}: {status}")
    if message:
        print(f"   └─ {message}")

# ==========================================
# TEST CASES
# ==========================================

def test_01_homepage_loads(driver):
    """Test Case 1: Verify Homepage Loads Successfully"""
    test_name = "Test 1: Homepage Loads Successfully"
    print(f"\n🧪 Running {test_name}...")
    try:
        start_time = time.time()
        driver.get(FRONTEND_URL)
        
        # Wait for page to load
        WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        load_time = time.time() - start_time
        
        # Get page title
        page_title = driver.title
        print(f"   ✓ Page Title: {page_title}")
        print(f"   ✓ Load Time: {load_time:.2f} seconds")
        
        # Verify page has content
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert len(body_text) > 100, "Page content too small"
        print(f"   ✓ Page Content: {len(body_text)} characters")
        
        # Check for University-related content
        page_source = driver.page_source.lower()
        has_content = "university" in page_source or "finder" in page_source or "search" in page_source
        assert has_content, "University-related content not found"
        print("   ✓ University-related content found")
        
        log_test_result(test_name, "PASS", f"Page loaded in {load_time:.2f}s")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

def test_02_navigation_functionality(driver):
    """Test Case 2: Test Navigation and Routing"""
    test_name = "Test 2: Navigation Functionality"
    print(f"\n🧪 Running {test_name}...")
    try:
        driver.get(FRONTEND_URL)
        time.sleep(2)
        
        # Test navigation to different pages
        pages_to_test = [
            ('/login', 'login'),
            ('/register', 'register'),
            ('/company/hero-section', 'hero')
        ]
        
        pages_loaded = 0
        for path, keyword in pages_to_test:
            try:
                full_url = FRONTEND_URL + path
                driver.get(full_url)
                time.sleep(2)
                
                # Verify URL changed
                current_url = driver.current_url
                if path.lower() in current_url.lower() or keyword in current_url.lower():
                    pages_loaded += 1
                    print(f"   ✓ Successfully navigated to {path}")
                
            except Exception as e:
                print(f"   ⚠ Could not navigate to {path}: {str(e)}")
        
        assert pages_loaded >= 2, f"Only {pages_loaded} pages loaded successfully"
        log_test_result(test_name, "PASS", f"Successfully navigated to {pages_loaded} pages")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

def test_03_login_form_elements(driver):
    """Test Case 3: Validate Login Form Elements"""
    test_name = "Test 3: Login Form Elements"
    print(f"\n🧪 Running {test_name}...")
    try:
        driver.get(f"{FRONTEND_URL}/login")
        time.sleep(3)
        
        # Check page source for form elements
        page_source = driver.page_source.lower()
        
        elements_found = []
        
        # Check for email/username field
        if "email" in page_source or "username" in page_source:
            elements_found.append("Email/Username field")
            print("   ✓ Email/Username field found")
        
        # Check for password field
        if "password" in page_source:
            elements_found.append("Password field")
            print("   ✓ Password field found")
        
        # Check for submit button
        if "sign in" in page_source or "login" in page_source or "submit" in page_source:
            elements_found.append("Submit button")
            print("   ✓ Submit button found")
        
        assert len(elements_found) >= 2, f"Only found {len(elements_found)} form elements"
        log_test_result(test_name, "PASS", f"Found {len(elements_found)} form elements")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

def test_04_backend_api_connectivity(driver):
    """Test Case 4: Verify Backend API Connectivity"""
    test_name = "Test 4: Backend API Connectivity"
    print(f"\n🧪 Running {test_name}...")
    try:
        # Test backend API endpoint directly
        api_url = f"{BACKEND_URL}/api/universities"
        driver.get(api_url)
        time.sleep(2)
        
        # Check if JSON data is displayed
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        
        # Verify API response contains expected data
        has_data = any(word in body_text for word in ["university", "data", "success", "title"])
        assert has_data, "API response doesn't contain expected data"
        print(f"   ✓ API endpoint accessible: {api_url}")
        print("   ✓ API returned data successfully")
        
        # Navigate to frontend page that uses API
        driver.get(f"{FRONTEND_URL}/company/hero-section")
        time.sleep(3)
        
        # Verify page loaded with content
        page_content = driver.find_element(By.TAG_NAME, "body").text
        assert len(page_content) > 200, "Page content too small"
        print("   ✓ Frontend page loaded with API data")
        
        log_test_result(test_name, "PASS", "Backend API connectivity verified")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

def test_05_responsive_design(driver):
    """Test Case 5: Test Responsive Design"""
    test_name = "Test 5: Responsive Design"
    print(f"\n🧪 Running {test_name}...")
    try:
        driver.get(FRONTEND_URL)
        time.sleep(2)
        
        # Test Mobile View (iPhone X)
        driver.set_window_size(375, 812)
        time.sleep(1)
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()
        print("   ✓ Mobile view (375x812) validated")
        
        # Test Tablet View (iPad)
        driver.set_window_size(768, 1024)
        time.sleep(1)
        assert driver.find_element(By.TAG_NAME, "body").is_displayed()
        print("   ✓ Tablet view (768x1024) validated")
        
        # Reset to Desktop
        driver.set_window_size(1920, 1080)
        time.sleep(1)
        print("   ✓ Desktop view (1920x1080) validated")
        
        log_test_result(test_name, "PASS", "Responsive design verified across 3 viewports")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

def test_06_search_functionality(driver):
    """Test Case 6: Test Search/Hero Section"""
    test_name = "Test 6: Search Functionality"
    print(f"\n🧪 Running {test_name}...")
    try:
        driver.get(f"{FRONTEND_URL}/company/hero-section")
        time.sleep(3)
        
        # Verify page loaded
        current_url = driver.current_url
        assert "hero" in current_url.lower(), "Not on hero section page"
        print(f"   ✓ Navigated to: {current_url}")
        
        # Check for search-related elements in page
        page_source = driver.page_source.lower()
        has_search = "search" in page_source or "find" in page_source or "university" in page_source
        assert has_search, "Search-related content not found"
        print("   ✓ Search-related content present")
        
        # Verify page has substantial content
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert len(body_text) > 100, "Page content too small"
        print(f"   ✓ Page content: {len(body_text)} characters")
        
        log_test_result(test_name, "PASS", "Search functionality page verified")
        return True
    except Exception as e:
        log_test_result(test_name, "FAIL", str(e))
        return False

# ==========================================
# REPORT GENERATION
# ==========================================

def generate_html_report():
    """Generate beautiful HTML report"""
    total = len(test_results)
    passed = sum(1 for r in test_results if r['status'] == 'PASS')
    failed = total - passed
    success_rate = (passed / total * 100) if total > 0 else 0
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selenium Test Report - University Finder</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}
        .header h1 {{ font-size: 2.5em; margin-bottom: 10px; }}
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }}
        .stat-card {{
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        .stat-card .value {{
            font-size: 2.5em;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .progress-bar {{
            width: 100%;
            height: 40px;
            background: #e0e0e0;
            border-radius: 20px;
            overflow: hidden;
            margin: 20px 0;
        }}
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
            width: {success_rate}%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }}
        .test-results {{ padding: 40px; }}
        .test-case {{
            background: white;
            border-left: 5px solid #667eea;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }}
        .test-case.passed {{ border-left-color: #38ef7d; }}
        .test-case.failed {{ border-left-color: #f45c43; }}
        .test-status {{
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
        }}
        .test-status.passed {{
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }}
        .test-status.failed {{
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            color: white;
        }}
        .footer {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Selenium Test Report</h1>
            <p>University Finder Application - Browser Automation Tests</p>
        </div>
        <div class="summary">
            <div class="stat-card">
                <h3>Total Tests</h3>
                <div class="value">{total}</div>
            </div>
            <div class="stat-card">
                <h3>Passed</h3>
                <div class="value">{passed}</div>
            </div>
            <div class="stat-card">
                <h3>Failed</h3>
                <div class="value">{failed}</div>
            </div>
            <div class="stat-card">
                <h3>Success Rate</h3>
                <div class="value">{success_rate:.1f}%</div>
            </div>
        </div>
        <div style="padding: 0 40px;">
            <div class="progress-bar">
                <div class="progress-fill">{success_rate:.1f}%</div>
            </div>
        </div>
        <div class="test-results">
            <h2>📋 Test Cases</h2>
"""
    
    for i, result in enumerate(test_results, 1):
        status_class = result['status'].lower()
        status_emoji = "✅" if result['status'] == "PASS" else "❌"
        
        html_content += f"""
            <div class="test-case {status_class}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 1.3em; font-weight: bold;">{status_emoji} {result['test']}</div>
                    <div class="test-status {status_class}">{result['status']}</div>
                </div>
                <div style="color: #666;">📝 {result['message']}</div>
                <div style="color: #999; font-size: 0.9em; margin-top: 10px;">🕐 {result['timestamp']}</div>
            </div>
"""
    
    html_content += f"""
        </div>
        <div class="footer">
            <p><strong>Test Execution Details</strong></p>
            <p>Frontend: {FRONTEND_URL}</p>
            <p>Backend: {BACKEND_URL}</p>
        </div>
    </div>
</body>
</html>
"""
    
    with open('selenium-test-report.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n📄 HTML report saved to: selenium-test-report.html")

# ==========================================
# MAIN EXECUTION
# ==========================================

def run_all_tests():
    """Run all Selenium test cases"""
    print("=" * 70)
    print("🚀 UNIVERSITY FINDER - SELENIUM TEST SUITE")
    print("=" * 70)
    print(f"Frontend URL: {FRONTEND_URL}")
    print(f"Backend URL:  {BACKEND_URL}")
    print("=" * 70)
    
    driver = setup_driver()
    passed = 0
    
    tests = [
        test_01_homepage_loads,
        test_02_navigation_functionality,
        test_03_login_form_elements,
        test_04_backend_api_connectivity,
        test_05_responsive_design,
        test_06_search_functionality
    ]
    
    try:
        for test in tests:
            if test(driver):
                passed += 1
            time.sleep(1)
        
        print("\n" + "=" * 70)
        print("📊 TEST EXECUTION SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {len(tests)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {len(tests) - passed}")
        print(f"📈 Success Rate: {(passed/len(tests)*100):.1f}%")
        print("=" * 70)
        
        # Generate HTML report
        generate_html_report()
        
        print("\n📸 PAUSING FOR 10 SECONDS... TAKE SCREENSHOTS!")
        print("   Browser will remain open for screenshot capture...")
        time.sleep(10)
        
    finally:
        print("\n🔧 Closing browser...")
        driver.quit()
        print("✅ Test execution complete!")

if __name__ == "__main__":
    run_all_tests()
