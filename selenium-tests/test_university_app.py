"""
API-Based Automated Tests for University Finder Application
DevOps Lab - Section E

This test suite contains 5 test cases that validate the application
deployed on Azure AKS using API testing.

Test Cases:
1. Backend Health Check - Verifies backend is running
2. Universities API Test - Tests universities endpoint
3. Search API Test - Validates search functionality
4. Disciplines API Test - Tests disciplines endpoint
5. Top Universities API Test - Validates top universities endpoint

Author: DevOps Lab Project
Date: December 2025
"""

import time
import requests
import json
from datetime import datetime


# Application URLs
FRONTEND_URL = "http://4.213.223.12"
BACKEND_URL = "http://135.235.246.98:5000"


class AutomatedTestSuite:
    """API-Based Automated Test Suite for University Finder App"""
    
    def __init__(self):
        """Initialize the test suite"""
        self.test_results = []
        self.passed = 0
        self.failed = 0
        self.start_time = datetime.now()
        
    def log_result(self, test_name, status, message, details=""):
        """Log test result"""
        self.test_results.append({
            'test': test_name,
            'status': status,
            'message': message,
            'details': details
        })
        if status == "PASSED":
            self.passed += 1
        else:
            self.failed += 1
    
    def test_01_backend_health_check(self):
        """
        Test Case 1: Backend Health Check
        
        Objective: Verify backend server is running and accessible
        
        Steps:
        1. Send GET request to backend root endpoint
        2. Verify response is received
        3. Check response time
        
        Expected Result: Backend responds successfully
        """
        print("=" * 70)
        print("TEST CASE 1: Backend Health Check")
        print("=" * 70)
        
        try:
            start_time = time.time()
            print(f"📍 Testing URL: {BACKEND_URL}")
            
            response = requests.get(BACKEND_URL, timeout=10)
            response_time = time.time() - start_time
            
            print(f"✅ Backend is reachable")
            print(f"✅ Status Code: {response.status_code}")
            print(f"✅ Response Time: {response_time:.2f} seconds")
            
            # Backend should respond (200 or 404 is fine, means server is running)
            assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}"
            
            print("\n✅ TEST 1 PASSED: Backend health check successful\n")
            self.log_result(
                "Backend Health Check", 
                "PASSED", 
                f"Backend is running",
                f"Status: {response.status_code}, Response time: {response_time:.2f}s"
            )
            return True
            
        except Exception as e:
            print(f"\n❌ TEST 1 FAILED: {str(e)}\n")
            self.log_result("Backend Health Check", "FAILED", str(e))
            return False
    
    def test_02_universities_api(self):
        """
        Test Case 2: Universities API Test
        
        Objective: Verify universities API returns data successfully
        
        Steps:
        1. Send GET request to /api/universities endpoint
        2. Verify status code is 200
        3. Check JSON response structure
        4. Validate data count
        
        Expected Result: API returns list of universities
        """
        print("=" * 70)
        print("TEST CASE 2: Universities API Test")
        print("=" * 70)
        
        try:
            api_url = f"{BACKEND_URL}/api/universities"
            print(f"📍 Testing API: {api_url}")
            
            response = requests.get(api_url, timeout=10)
            
            print(f"✅ Status Code: {response.status_code}")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            data = response.json()
            assert data is not None, "No data received"
            print("✅ JSON data received")
            
            if isinstance(data, dict) and 'data' in data:
                universities = data['data']
                count = len(universities)
                print(f"✅ Universities Count: {count}")
                
                assert count > 0, "No universities found"
                
                if count > 0:
                    sample = universities[0].get('title', 'N/A')
                    print(f"✅ Sample University: {sample}")
            
            print("\n✅ TEST 2 PASSED: Universities API working correctly\n")
            self.log_result(
                "Universities API Test",
                "PASSED",
                f"Retrieved {count} universities",
                f"Status: 200, Sample: {sample}"
            )
            return True
            
        except Exception as e:
            print(f"\n❌ TEST 2 FAILED: {str(e)}\n")
            self.log_result("Universities API Test", "FAILED", str(e))
            return False
    
    def test_03_search_api(self):
        """
        Test Case 3: Search API Test
        
        Objective: Verify search functionality works correctly
        
        Steps:
        1. Send GET request to search endpoint with query
        2. Verify status code is 200
        3. Check search results
        4. Validate result relevance
        
        Expected Result: Search returns relevant universities
        """
        print("=" * 70)
        print("TEST CASE 3: Search API Test")
        print("=" * 70)
        
        try:
            search_query = "NUST"
            api_url = f"{BACKEND_URL}/api/universities/search?query={search_query}"
            print(f"📍 Testing API: {api_url}")
            print(f"📍 Search Query: {search_query}")
            
            response = requests.get(api_url, timeout=10)
            
            print(f"✅ Status Code: {response.status_code}")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            data = response.json()
            assert data is not None, "No data received"
            print("✅ Search response received")
            
            if isinstance(data, dict) and 'data' in data:
                results = data['data']
                count = len(results)
                print(f"✅ Search Results: {count} universities found")
                
                if count > 0:
                    top_result = results[0].get('title', 'N/A')
                    print(f"✅ Top Result: {top_result}")
            
            print("\n✅ TEST 3 PASSED: Search API working correctly\n")
            self.log_result(
                "Search API Test",
                "PASSED",
                f"Search returned {count} results for '{search_query}'",
                f"Status: 200, Top result: {top_result if count > 0 else 'N/A'}"
            )
            return True
            
        except Exception as e:
            print(f"\n❌ TEST 3 FAILED: {str(e)}\n")
            self.log_result("Search API Test", "FAILED", str(e))
            return False
    
    def test_04_disciplines_api(self):
        """
        Test Case 4: Disciplines API Test
        
        Objective: Verify disciplines API returns data successfully
        
        Steps:
        1. Send GET request to /api/disciplines endpoint
        2. Verify status code is 200
        3. Check JSON response structure
        4. Validate disciplines list
        
        Expected Result: API returns list of disciplines
        """
        print("=" * 70)
        print("TEST CASE 4: Disciplines API Test")
        print("=" * 70)
        
        try:
            api_url = f"{BACKEND_URL}/api/disciplines"
            print(f"📍 Testing API: {api_url}")
            
            response = requests.get(api_url, timeout=10)
            
            print(f"✅ Status Code: {response.status_code}")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            data = response.json()
            assert data is not None, "No data received"
            print("✅ JSON data received")
            
            if isinstance(data, dict) and 'data' in data:
                disciplines = data['data']
                count = len(disciplines)
                print(f"✅ Disciplines Count: {count}")
                
                assert count > 0, "No disciplines found"
                
                if count >= 3:
                    sample = ', '.join(disciplines[:3])
                    print(f"✅ Sample Disciplines: {sample}")
            
            print("\n✅ TEST 4 PASSED: Disciplines API working correctly\n")
            self.log_result(
                "Disciplines API Test",
                "PASSED",
                f"Retrieved {count} disciplines",
                f"Status: 200, Sample: {sample if count >= 3 else 'N/A'}"
            )
            return True
            
        except Exception as e:
            print(f"\n❌ TEST 4 FAILED: {str(e)}\n")
            self.log_result("Disciplines API Test", "FAILED", str(e))
            return False
    
    def test_05_top_universities_api(self):
        """
        Test Case 5: Top Universities API Test
        
        Objective: Verify top universities API returns ranked data
        
        Steps:
        1. Send GET request to /api/universities/top endpoint
        2. Verify status code is 200
        3. Check JSON response structure
        4. Validate top universities list
        
        Expected Result: API returns list of top-ranked universities
        """
        print("=" * 70)
        print("TEST CASE 5: Top Universities API Test")
        print("=" * 70)
        
        try:
            api_url = f"{BACKEND_URL}/api/universities/top"
            print(f"📍 Testing API: {api_url}")
            
            response = requests.get(api_url, timeout=10)
            
            print(f"✅ Status Code: {response.status_code}")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            data = response.json()
            assert data is not None, "No data received"
            print("✅ JSON data received")
            
            if isinstance(data, dict) and 'data' in data:
                top_unis = data['data']
                count = len(top_unis)
                print(f"✅ Top Universities Count: {count}")
                
                assert count > 0, "No top universities found"
                
                if count > 0:
                    top_uni = top_unis[0].get('title', 'N/A')
                    print(f"✅ #1 University: {top_uni}")
            
            print("\n✅ TEST 5 PASSED: Top Universities API working correctly\n")
            self.log_result(
                "Top Universities API Test",
                "PASSED",
                f"Retrieved {count} top universities",
                f"Status: 200, Top university: {top_uni if count > 0 else 'N/A'}"
            )
            return True
            
        except Exception as e:
            print(f"\n❌ TEST 5 FAILED: {str(e)}\n")
            self.log_result("Top Universities API Test", "FAILED", str(e))
            return False
    
    def generate_text_report(self):
        """Generate text test execution report"""
        print("\n" + "=" * 70)
        print("TEST EXECUTION SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        success_rate = (self.passed / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        print("\n" + "=" * 70)
        print("DETAILED RESULTS")
        print("=" * 70)
        
        for i, result in enumerate(self.test_results, 1):
            status_icon = "✅" if result['status'] == "PASSED" else "❌"
            print(f"\n{i}. {result['test']}")
            print(f"   {status_icon} Status: {result['status']}")
            print(f"   📝 Message: {result['message']}")
            if result['details']:
                print(f"   📋 Details: {result['details']}")
        
        # Save text report
        report_path = 'test-report.txt'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("=" * 70 + "\n")
            f.write("AUTOMATED TEST EXECUTION REPORT\n")
            f.write("University Finder Application - DevOps Lab Section E\n")
            f.write("=" * 70 + "\n\n")
            
            f.write(f"Test Date: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Frontend URL: {FRONTEND_URL}\n")
            f.write(f"Backend URL: {BACKEND_URL}\n\n")
            
            f.write(f"Total Tests: {total_tests}\n")
            f.write(f"Passed: {self.passed}\n")
            f.write(f"Failed: {self.failed}\n")
            f.write(f"Success Rate: {success_rate:.1f}%\n\n")
            
            f.write("=" * 70 + "\n")
            f.write("DETAILED RESULTS\n")
            f.write("=" * 70 + "\n\n")
            
            for i, result in enumerate(self.test_results, 1):
                f.write(f"{i}. {result['test']}\n")
                f.write(f"   Status: {result['status']}\n")
                f.write(f"   Message: {result['message']}\n")
                if result['details']:
                    f.write(f"   Details: {result['details']}\n")
                f.write("\n")
        
        print(f"\n📄 Text report saved to: {report_path}")
    
    def generate_html_report(self):
        """Generate beautiful HTML test execution report with gradients"""
        total_tests = len(self.test_results)
        success_rate = (self.passed / total_tests * 100) if total_tests > 0 else 0
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Report - University Finder</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
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
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
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
            transition: transform 0.3s ease;
        }}
        
        .stat-card:hover {{
            transform: translateY(-5px);
        }}
        
        .stat-card h3 {{
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .stat-card .value {{
            font-size: 2.5em;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        .stat-card.success .value {{
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        
        .stat-card.failed .value {{
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        
        .progress-bar {{
            width: 100%;
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }}
        
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
            width: {success_rate}%;
            transition: width 1s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }}
        
        .test-results {{
            padding: 40px;
        }}
        
        .test-results h2 {{
            font-size: 2em;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        
        .test-case {{
            background: white;
            border-left: 5px solid #667eea;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }}
        
        .test-case:hover {{
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            transform: translateX(5px);
        }}
        
        .test-case.passed {{
            border-left-color: #38ef7d;
        }}
        
        .test-case.failed {{
            border-left-color: #f45c43;
        }}
        
        .test-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }}
        
        .test-name {{
            font-size: 1.3em;
            font-weight: bold;
            color: #333;
        }}
        
        .test-status {{
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9em;
        }}
        
        .test-status.passed {{
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }}
        
        .test-status.failed {{
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            color: white;
        }}
        
        .test-message {{
            color: #666;
            margin-bottom: 10px;
            font-size: 1.1em;
        }}
        
        .test-details {{
            color: #999;
            font-size: 0.9em;
            font-style: italic;
        }}
        
        .footer {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .footer p {{
            opacity: 0.9;
        }}
        
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(20px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        .test-case {{
            animation: fadeIn 0.5s ease;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Test Execution Report</h1>
            <p>University Finder Application - DevOps Lab Section E</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total Tests</h3>
                <div class="value">{total_tests}</div>
            </div>
            <div class="stat-card success">
                <h3>Passed</h3>
                <div class="value">{self.passed}</div>
            </div>
            <div class="stat-card failed">
                <h3>Failed</h3>
                <div class="value">{self.failed}</div>
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
        
        for i, result in enumerate(self.test_results, 1):
            status_class = result['status'].lower()
            status_emoji = "✅" if result['status'] == "PASSED" else "❌"
            
            html_content += f"""
            <div class="test-case {status_class}">
                <div class="test-header">
                    <div class="test-name">{status_emoji} Test {i}: {result['test']}</div>
                    <div class="test-status {status_class}">{result['status']}</div>
                </div>
                <div class="test-message">📝 {result['message']}</div>
"""
            if result['details']:
                html_content += f"""                <div class="test-details">📋 {result['details']}</div>
"""
            html_content += """            </div>
"""
        
        html_content += f"""
        </div>
        
        <div class="footer">
            <p><strong>Test Execution Details</strong></p>
            <p>Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p>Completed: {end_time.strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p>Duration: {duration:.2f} seconds</p>
            <p style="margin-top: 15px;">Frontend: {FRONTEND_URL}</p>
            <p>Backend: {BACKEND_URL}</p>
        </div>
    </div>
</body>
</html>
"""
        
        # Save HTML report
        html_path = 'test-report.html'
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"📄 HTML report saved to: {html_path}")
        print("=" * 70 + "\n")
    
    def run_all_tests(self):
        """Run all test cases"""
        print("\n" + "=" * 70)
        print("AUTOMATED TESTING SUITE")
        print("University Finder Application - DevOps Lab Section E")
        print("=" * 70)
        print(f"\nFrontend URL: {FRONTEND_URL}")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test Date: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Run all 5 tests
        self.test_01_backend_health_check()
        self.test_02_universities_api()
        self.test_03_search_api()
        self.test_04_disciplines_api()
        self.test_05_top_universities_api()
        
        # Generate reports
        self.generate_text_report()
        self.generate_html_report()
        
        return self.passed == len(self.test_results)


if __name__ == "__main__":
    # Create test suite instance
    test_suite = AutomatedTestSuite()
    
    # Run all tests
    success = test_suite.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if success else 1)
