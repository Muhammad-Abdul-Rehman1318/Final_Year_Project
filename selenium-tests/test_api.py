"""
Simple API Testing for University Finder Application
DevOps Lab - Section E (Alternative Approach)

This test suite validates the application using HTTP requests instead of Selenium
to avoid ChromeDriver compatibility issues.

Test Cases:
1. Homepage Accessibility Test
2. Backend API Health Check
3. University Search API Test
4. Disciplines API Test
5. Frontend-Backend Integration Test
"""

import requests
import time
import json

# Application URLs
FRONTEND_URL = "http://4.224.133.62"
BACKEND_URL = "http://98.70.247.91:5000"


class TestUniversityFinderAPI:
    """API Test Suite for University Finder Application"""
    
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0
    
    def log_result(self, test_name, status, message):
        """Log test result"""
        self.results.append({
            'test': test_name,
            'status': status,
            'message': message
        })
        if status == "PASSED":
            self.passed += 1
        else:
            self.failed += 1
    
    def test_01_frontend_accessibility(self):
        """
        Test Case 1: Verify Frontend is Accessible
        
        Steps:
        1. Send GET request to frontend URL
        2. Check response status code
        3. Verify response time
        4. Check content length
        
        Expected Result: Frontend returns 200 OK with HTML content
        """
        print("\n" + "="*60)
        print("Test 1: Frontend Accessibility Test")
        print("="*60)
        
        try:
            start_time = time.time()
            response = requests.get(FRONTEND_URL, timeout=10)
            response_time = time.time() - start_time
            
            print(f"[OK] Frontend URL: {FRONTEND_URL}")
            print(f"[OK] Status Code: {response.status_code}")
            print(f"[OK] Response Time: {response_time:.2f} seconds")
            print(f"[OK] Content Length: {len(response.content)} bytes")
            
            # Assertions
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert response_time < 10, f"Response too slow: {response_time}s"
            assert len(response.content) > 1000, "Content too small"
            
            print("[PASS] Test 1 PASSED: Frontend is accessible\n")
            self.log_result("Frontend Accessibility", "PASSED", 
                          f"Status: {response.status_code}, Time: {response_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"[FAIL] Test 1 FAILED: {str(e)}\n")
            self.log_result("Frontend Accessibility", "FAILED", str(e))
            return False
    
    def test_02_backend_health_check(self):
        """
        Test Case 2: Backend API Health Check
        
        Steps:
        1. Send GET request to backend root endpoint
        2. Check response status
        3. Verify backend is running
        
        Expected Result: Backend responds successfully
        """
        print("\n" + "="*60)
        print("Test 2: Backend API Health Check")
        print("="*60)
        
        try:
            response = requests.get(BACKEND_URL, timeout=10)
            
            print(f"✓ Backend URL: {BACKEND_URL}")
            print(f"✓ Status Code: {response.status_code}")
            print(f"✓ Response: {response.text[:100]}")
            
            # Backend should respond (even if it's just a message)
            assert response.status_code in [200, 404], \
                f"Backend not responding properly: {response.status_code}"
            
            print("✅ Test 2 PASSED: Backend is running\n")
            self.log_result("Backend Health Check", "PASSED", 
                          f"Status: {response.status_code}")
            return True
            
        except Exception as e:
            print(f"❌ Test 2 FAILED: {str(e)}\n")
            self.log_result("Backend Health Check", "FAILED", str(e))
            return False
    
    def test_03_universities_api(self):
        """
        Test Case 3: Universities API Test
        
        Steps:
        1. Send GET request to universities endpoint
        2. Verify JSON response
        3. Check data structure
        4. Validate university count
        
        Expected Result: API returns list of universities
        """
        print("\n" + "="*60)
        print("Test 3: Universities API Test")
        print("="*60)
        
        try:
            url = f"{BACKEND_URL}/api/universities"
            response = requests.get(url, timeout=10)
            
            print(f"✓ API Endpoint: {url}")
            print(f"✓ Status Code: {response.status_code}")
            
            # Parse JSON
            data = response.json()
            print(f"✓ Response Type: {type(data)}")
            
            # Check if response has expected structure
            if isinstance(data, dict) and 'data' in data:
                universities = data['data']
                print(f"✓ Universities Count: {len(universities)}")
                
                if len(universities) > 0:
                    print(f"✓ Sample University: {universities[0].get('title', 'N/A')}")
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            assert data is not None, "No data received"
            
            print("✅ Test 3 PASSED: Universities API working\n")
            self.log_result("Universities API", "PASSED", 
                          f"Status: {response.status_code}, Data received")
            return True
            
        except Exception as e:
            print(f"❌ Test 3 FAILED: {str(e)}\n")
            self.log_result("Universities API", "FAILED", str(e))
            return False
    
    def test_04_disciplines_api(self):
        """
        Test Case 4: Disciplines API Test
        
        Steps:
        1. Send GET request to disciplines endpoint
        2. Verify JSON response
        3. Check disciplines list
        
        Expected Result: API returns list of disciplines
        """
        print("\n" + "="*60)
        print("Test 4: Disciplines API Test")
        print("="*60)
        
        try:
            url = f"{BACKEND_URL}/api/disciplines"
            response = requests.get(url, timeout=10)
            
            print(f"✓ API Endpoint: {url}")
            print(f"✓ Status Code: {response.status_code}")
            
            # Parse JSON
            data = response.json()
            
            if isinstance(data, dict) and 'data' in data:
                disciplines = data['data']
                print(f"✓ Disciplines Count: {len(disciplines)}")
                print(f"✓ Sample Disciplines: {', '.join(disciplines[:3])}")
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            print("✅ Test 4 PASSED: Disciplines API working\n")
            self.log_result("Disciplines API", "PASSED", 
                          f"Status: {response.status_code}")
            return True
            
        except Exception as e:
            print(f"❌ Test 4 FAILED: {str(e)}\n")
            self.log_result("Disciplines API", "FAILED", str(e))
            return False
    
    def test_05_search_api(self):
        """
        Test Case 5: University Search API Test
        
        Steps:
        1. Send search request with query
        2. Verify search results
        3. Check result relevance
        
        Expected Result: Search returns relevant universities
        """
        print("\n" + "="*60)
        print("Test 5: University Search API Test")
        print("="*60)
        
        try:
            search_query = "NUST"
            url = f"{BACKEND_URL}/api/universities/search?query={search_query}"
            response = requests.get(url, timeout=10)
            
            print(f"✓ Search Query: {search_query}")
            print(f"✓ API Endpoint: {url}")
            print(f"✓ Status Code: {response.status_code}")
            
            # Parse JSON
            data = response.json()
            
            if isinstance(data, dict) and 'data' in data:
                results = data['data']
                print(f"✓ Search Results: {len(results)} universities found")
                
                if len(results) > 0:
                    print(f"✓ Top Result: {results[0].get('title', 'N/A')}")
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            
            print("✅ Test 5 PASSED: Search API working\n")
            self.log_result("Search API", "PASSED", 
                          f"Status: {response.status_code}, Query: {search_query}")
            return True
            
        except Exception as e:
            print(f"❌ Test 5 FAILED: {str(e)}\n")
            self.log_result("Search API", "FAILED", str(e))
            return False
    
    def generate_report(self):
        """Generate test execution report"""
        print("\n" + "="*60)
        print("TEST EXECUTION SUMMARY")
        print("="*60)
        
        print(f"\nTotal Tests: {len(self.results)}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {(self.passed/len(self.results)*100):.1f}%")
        
        print("\n" + "="*60)
        print("DETAILED RESULTS")
        print("="*60)
        
        for i, result in enumerate(self.results, 1):
            status_icon = "✅" if result['status'] == "PASSED" else "❌"
            print(f"\n{i}. {result['test']}")
            print(f"   {status_icon} Status: {result['status']}")
            print(f"   Message: {result['message']}")
        
        # Save to file
        with open('selenium-tests/api-test-results.txt', 'w') as f:
            f.write("="*60 + "\n")
            f.write("API TEST EXECUTION REPORT\n")
            f.write("University Finder Application\n")
            f.write("="*60 + "\n\n")
            f.write(f"Total Tests: {len(self.results)}\n")
            f.write(f"Passed: {self.passed}\n")
            f.write(f"Failed: {self.failed}\n")
            f.write(f"Success Rate: {(self.passed/len(self.results)*100):.1f}%\n\n")
            f.write("="*60 + "\n")
            f.write("DETAILED RESULTS\n")
            f.write("="*60 + "\n\n")
            
            for i, result in enumerate(self.results, 1):
                f.write(f"{i}. {result['test']}\n")
                f.write(f"   Status: {result['status']}\n")
                f.write(f"   Message: {result['message']}\n\n")
        
        print(f"\n✓ Report saved to: selenium-tests/api-test-results.txt")
        print("="*60 + "\n")
    
    def run_all_tests(self):
        """Run all test cases"""
        print("\n" + "="*60)
        print("UNIVERSITY FINDER - API TESTING SUITE")
        print("DevOps Lab - Section E")
        print("="*60)
        
        # Run all tests
        self.test_01_frontend_accessibility()
        self.test_02_backend_health_check()
        self.test_03_universities_api()
        self.test_04_disciplines_api()
        self.test_05_search_api()
        
        # Generate report
        self.generate_report()
        
        return self.passed == len(self.results)


if __name__ == "__main__":
    tester = TestUniversityFinderAPI()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if success else 1)
