from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import unittest
import time

class LocalAppTest(unittest.TestCase):
    def setUp(self):
        # chrome_options = Options()
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:5173/")
        self.wait = WebDriverWait(self.driver, 4)

    def tearDown(self):
        self.driver.quit()

    def run(self, result=None):
        start_time = time.time()
        super().run(result)
        end_time = time.time()
        print(f"{self.id()} took {end_time - start_time:.2f} seconds")

    def test_login_btn_pres(self):
        login_btn_xpath = "/html/body/div/main/div[2]/div/button[2]"
        try:
            print("Waiting for Login Button")
            login_btn = self.wait.until(EC.visibility_of_element_located((By.XPATH, login_btn_xpath)))
            self.assertTrue(login_btn.is_displayed(), "Button is not present or not visible on the page.")
        except TimeoutException:
            print("Login Button not found.")
            return

    def test_login_flow(self):
        login_btn_xpath = "/html/body/div/main/div[2]/div/button[2]"
        try:
            print("Waiting for Login Button")
            login_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, login_btn_xpath)))
            login_button.click()

            email_input_id = "email"
            print("Waiting for Email Input")
            email_input = self.wait.until(EC.visibility_of_element_located((By.ID, email_input_id)))
            email_input.send_keys("guest@gmail.com")
            
            password_input_id = "password"        
            print("Waiting for Password Input")
            password_input = self.wait.until(EC.visibility_of_element_located((By.ID, password_input_id)))
            password_input.send_keys("12345")

            submit_btn_xpath = "/html/body/div/main/div[2]/div/form/button"
            print("Waiting for Submit Button")
            submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, submit_btn_xpath)))
            submit_button.click()

            profile_header_xpath = "/html/body/div/main/div[2]/div/h1"
            print("Waiting for Profile Header")
            profile_header = self.wait.until(EC.visibility_of_element_located((By.XPATH, profile_header_xpath)))
            self.assertTrue(profile_header.is_displayed(), "Profile header not detected, login might have failed.")
        except TimeoutException:
            print("Login Test failed.")
            return

    def test_account_creation(self):
        sign_up_btn_xpath = "/html/body/div/main/div[2]/div/button[1]"
        try:
            print("Waiting for Sign Up Button")
            sign_up_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, sign_up_btn_xpath)))
            sign_up_button.click()

            last_name_input_id = "last_name"
            print("Waiting for Last Name Input")
            last_name_input = self.wait.until(EC.visibility_of_element_located((By.ID, last_name_input_id)))
            last_name_input.send_keys("Bora Bayazit")

            email_input_id = "email"
            print("Waiting for Email Input")
            email_input = self.wait.until(EC.visibility_of_element_located((By.ID, email_input_id)))
            email_input.send_keys("bora@hotmail.ca")

            password_input_id = "password"
            print("Waiting for Password Input")
            password_input = self.wait.until(EC.visibility_of_element_located((By.ID, password_input_id)))
            password_input.send_keys("12345")

            confirm_password_input_id = "confirmPassword"
            print("Waiting for Confirm Password Input")
            confirm_password_input = self.wait.until(EC.visibility_of_element_located((By.ID, confirm_password_input_id)))
            confirm_password_input.send_keys("12345")

            major_dropdown_id = "major"
            print("Waiting for Major Dropdown")
            major_dropdown = self.wait.until(EC.visibility_of_element_located((By.ID, major_dropdown_id)))
            major_dropdown.send_keys("Electrical & Computer")

            grad_year_input_id = "grad_year"
            print("Waiting for Graduation Year Input")
            grad_year_input = self.wait.until(EC.visibility_of_element_located((By.ID, grad_year_input_id)))
            grad_year_input.send_keys("2025")

            minor_dropdown_id = "minor"
            print("Waiting for Minor Dropdown")
            minor_dropdown = self.wait.until(EC.visibility_of_element_located((By.ID, minor_dropdown_id)))
            minor_dropdown.send_keys("AI Engineering")

            gpa_input_id = "gpa"
            print("Waiting for GPA Input")
            gpa_input = self.wait.until(EC.visibility_of_element_located((By.ID, gpa_input_id)))
            gpa_input.send_keys("4.0")

            submit_btn_xpath = "/html/body/div/main/div[2]/div/div/div/div[4]/button[2]"
            print("Waiting for Submit Button")
            submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, submit_btn_xpath)))
            self.driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
            time.sleep(1)
            submit_button.click()

            profile_header_xpath = "/html/body/div/main/div[2]/div/h1"
            print("Waiting for Profile Header")
            profile_header = self.wait.until(EC.visibility_of_element_located((By.XPATH, profile_header_xpath)))
            self.assertTrue(profile_header.is_displayed(), "Profile header not detected, account creation might have failed.")
        except TimeoutException:
            print("Account Creation Test failed.")
            return
        
    def test_logout(self):
        self.test_login_flow()

        profile_menu_xpath = "/html/body/div/main/div[1]/nav/div/ul[2]/li/a"
        sign_out_btn_xpath = "/html/body/div/main/div[1]/nav/div/ul[2]/li/div/button"
        sign_up_btn_xpath = "/html/body/div/main/div[2]/div/button[1]"

        try:
            print("Waiting for Profile Menu")
            profile_menu = self.wait.until(EC.element_to_be_clickable((By.XPATH, profile_menu_xpath)))
            profile_menu.click()

            print("Waiting for Sign Out Button")
            sign_out_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, sign_out_btn_xpath)))
            sign_out_button.click()

            print("Waiting for Sign Up Button")
            sign_up_button = self.wait.until(EC.visibility_of_element_located((By.XPATH, sign_up_btn_xpath)))
            self.assertTrue(sign_up_button.is_displayed(), "Sign up button not detected, logout might have failed.")
        except TimeoutException:
            print("Logout Test failed.")
            return
        
    def test_join_course(self):
        self.test_login_flow()

        courses_btn_xpath = "/html/body/div/main/div[1]/nav/div/ul[1]/li[1]/a"
        add_course_btn_xpath = "/html/body/div/main/div[2]/div/button"
        course_select_id = "course-select"
        next_btn_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[2]/button"
        check_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[1]/div/div[5]/label"
        confirm_btn_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[2]/button[2]"
        time_slot_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[1]/div/table/tbody/tr[3]/td[2]"
        meeting_times_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[1]/div/div[3]/label"
        skill_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[1]/div/div[3]/label"
        final_confirm_btn_xpath = "/html/body/div[3]/div/div[1]/div/div/div/div/div/div[2]/button[2]"
        course_header_xpath = "/html/body/div/main/div[2]/div/div/div/div/div/div/h5"

        try:
            print("Waiting for Courses Button")
            courses_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, courses_btn_xpath)))
            courses_button.click()

            print("Waiting for Add Course Button")
            add_course_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, add_course_btn_xpath)))
            add_course_button.click()

            print("Waiting for Course Select Dropdown")
            course_select = self.wait.until(EC.visibility_of_element_located((By.ID, course_select_id)))
            course_select.send_keys("CSC343")

            print("Waiting for Next Button")
            next_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, next_btn_xpath)))
            next_button.click()

            print("Waiting for Check")
            check = self.wait.until(EC.element_to_be_clickable((By.XPATH, check_xpath)))
            check.click()

            print("Waiting for Confirm Button")
            confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, confirm_btn_xpath)))
            confirm_button.click()

            print("Waiting for Time Slot")
            time_slot = self.wait.until(EC.element_to_be_clickable((By.XPATH, time_slot_xpath)))
            time_slot.click()

            print("Waiting for Confirm Button")
            confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, confirm_btn_xpath)))
            confirm_button.click()

            print("Waiting for Meeting Times")
            meeting_times = self.wait.until(EC.element_to_be_clickable((By.XPATH, meeting_times_xpath)))
            meeting_times.click()

            print("Waiting for Confirm Button")
            confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, confirm_btn_xpath)))
            confirm_button.click()

            print("Waiting for Skill")
            skill = self.wait.until(EC.element_to_be_clickable((By.XPATH, skill_xpath)))
            skill.click()

            print("Waiting for Confirm Button")
            confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, confirm_btn_xpath)))
            confirm_button.click()

            print("Waiting for Final Confirm Button")
            final_confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, final_confirm_btn_xpath)))
            final_confirm_button.click()

            time.sleep(1)

            print("Waiting for Course Header")
            course_header = self.wait.until(EC.visibility_of_element_located((By.XPATH, course_header_xpath)))
            self.assertTrue(course_header.is_displayed(), "Course header not detected, joining course might have failed.")
        except TimeoutException:
            print("Join Course Test failed.")
            return

    def test_view_course_team(self):
        self.test_login_flow()

        courses_btn_xpath = "/html/body/div/main/div[1]/nav/div/ul[1]/li[1]/a"
        course_btn_xpath = "/html/body/div/main/div[2]/div/div/div/div[1]/div/div/p/a"
        course_header_xpath = "/html/body/div/main/div[2]/div/h1"
        more_info_btn_xpath = "/html/body/div/main/div[2]/div/div[2]/div[1]/div/div/div[2]/button"
        teammate_header_xpath = "/html/body/div[2]/div/div[1]/div/div/div[2]/h5"

        try:
            print("Waiting for Courses Button")
            courses_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, courses_btn_xpath)))
            courses_button.click()

            print("Waiting for Course Button")
            course_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, course_btn_xpath)))
            course_button.click()

            time.sleep(1)

            print("Waiting for Course Header")
            course_header = self.wait.until(EC.visibility_of_element_located((By.XPATH, course_header_xpath)))
            self.assertTrue(course_header.is_displayed(), "Course header not detected, viewing course team might have failed.")

            print("Waiting for More Info Button")
            more_info_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, more_info_btn_xpath)))
            more_info_button.click()

            time.sleep(1)

            print("Waiting for Teammate Header")
            teammate_header = self.wait.until(EC.visibility_of_element_located((By.XPATH, teammate_header_xpath)))
            self.assertTrue(teammate_header.is_displayed(), "Teammate header not detected, viewing more info might have failed.")
        except TimeoutException:
            print("View Course Team Test failed.")
            return

    def test_write_review(self):
        self.test_view_course_team()

        write_review_btn_xpath = "/html/body/div[2]/div/div[1]/div/div/div[3]/button[2]"
        star_icon_xpath = "/html/body/div[2]/div/div[1]/div/div/div[2]/form/div[1]/div/svg[3]/path"
        comment_textarea_id = "comment"
        submit_review_btn_xpath = "/html/body/div[2]/div/div[1]/div/div/div[2]/form/button"

        try:
            print("Waiting for Write Review Button")
            write_review_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, write_review_btn_xpath)))
            write_review_button.click()

            print("Waiting for Star Icon")
            star_icon = self.wait.until(EC.element_to_be_clickable((By.XPATH, star_icon_xpath)))
            star_icon.click()

            print("Waiting for Comment Textarea")
            comment_textarea = self.wait.until(EC.visibility_of_element_located((By.ID, comment_textarea_id)))
            comment_textarea.send_keys("this is my comment")

            print("Waiting for Submit Recommendation Button")
            submit_review_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, submit_review_btn_xpath)))
            submit_review_button.click()
        except TimeoutException:
            print("Write Review Test failed.")
            return

    def test_delete_own_review(self):
        self.test_login_flow()

        delete_review_btn_xpath = "/html/body/div/main/div[2]/div/div[2]/div[1]/div/div/div[3]/button/svg"

        try:
            print("Waiting for Delete Review Button")
            delete_review_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, delete_review_btn_xpath)))
            delete_review_button.click()

            time.sleep(1)

            self.assertRaises(TimeoutException, self.wait.until, EC.element_to_be_clickable((By.XPATH, delete_review_btn_xpath)))
            print("Review deleted successfully.")
        except TimeoutException:
            print("Delete Own Review Test failed.")
            return

if __name__ == "__main__":
    unittest.main()
