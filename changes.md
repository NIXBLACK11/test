### ✅ **Requirements for Returning a User Object in the Leaderboard Query**  

Based on everything we debugged, here are all the key conditions that must be met for a user object to be returned:  

---

### **1️⃣ The User Must Exist in the `USERS` Table**  
- The user with `ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c'` **must exist** in `BACKEND.USERS`.  
- Check:  
  ```sql
  SELECT * FROM BACKEND.USERS WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c';
  ```

---

### **2️⃣ The User Must Have a Non-NULL Nickname**  
- `NICKNAME` must **not** be `NULL`, or the user will be excluded from the query.  
- Check:  
  ```sql
  SELECT ID, NICKNAME FROM BACKEND.USERS WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c';
  ```
- Fix if necessary:  
  ```sql
  UPDATE BACKEND.USERS SET NICKNAME = 'TestUser' 
  WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c';
  ```

---

### **3️⃣ The Leaderboard Must Exist & Be Public OR The User Must Be in It**  
- The `LEADERBOARDS` entry with `ID = '2a05c71a-3339-4298-ad04-be9ea1da0869'` **must exist**.  
- If the leaderboard is **private (`PRIVATE = TRUE`)**, the user **must** be in `USERS_LEADERBOARDS`.  
- Check:  
  ```sql
  SELECT PRIVATE FROM BACKEND.LEADERBOARDS WHERE ID = '2a05c71a-3339-4298-ad04-be9ea1da0869';
  ```
- If private (`PRIVATE = TRUE`), ensure the user is part of it:  
  ```sql
  SELECT * FROM BACKEND.USERS_LEADERBOARDS 
  WHERE USER_ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c'
  AND LEADERBOARD_ID = '2a05c71a-3339-4298-ad04-be9ea1da0869';
  ```
- Fix if necessary:  
  ```sql
  INSERT INTO BACKEND.USERS_LEADERBOARDS (USER_ID, LEADERBOARD_ID)
  VALUES ('1270d73c-2d41-4dc8-a84a-62c3c0e6410c', '2a05c71a-3339-4298-ad04-be9ea1da0869');
  ```

---

### **4️⃣ The User Must Have Activity Logged in `ACTIVITY` Table**  
- The user must have at least **one activity entry** within the leaderboard's `START_DATE` and `END_DATE`.  
- Check:  
  ```sql
  SELECT * FROM BACKEND.ACTIVITY 
  WHERE USER_ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c'
  AND CREATED_AT BETWEEN 
    (SELECT START_DATE FROM BACKEND.LEADERBOARDS WHERE ID = '2a05c71a-3339-4298-ad04-be9ea1da0869')
    AND 
    (SELECT END_DATE FROM BACKEND.LEADERBOARDS WHERE ID = '2a05c71a-3339-4298-ad04-be9ea1da0869');
  ```
- Fix if necessary:  
  ```sql
  INSERT INTO BACKEND.ACTIVITY (RESOURCE, AMOUNT, TYPE, USER_ID, CREATED_AT)
  VALUES ('test_resource', 100, 'test_type', '1270d73c-2d41-4dc8-a84a-62c3c0e6410c', NOW());
  ```

---

### **5️⃣ The User Must Have a Valid Favorite Avatar**  
- The user's `FAVORITE_AVATAR_ID` in `USERS` must **not be NULL**.  
- Check:  
  ```sql
  SELECT FAVORITE_AVATAR_ID FROM BACKEND.USERS 
  WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c';
  ```
- Fix if necessary:  
  ```sql
  UPDATE BACKEND.USERS 
  SET FAVORITE_AVATAR_ID = (SELECT ID FROM BACKEND.AVATARS LIMIT 1) 
  WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c';
  ```

---

### **6️⃣ The Favorite Avatar Must Exist in `AVATARS` Table**  
- The avatar ID from `USERS.FAVORITE_AVATAR_ID` must exist in `BACKEND.AVATARS`.  
- Check:  
  ```sql
  SELECT * FROM BACKEND.AVATARS 
  WHERE ID = (SELECT FAVORITE_AVATAR_ID FROM BACKEND.USERS 
              WHERE ID = '1270d73c-2d41-4dc8-a84a-62c3c0e6410c');
  ```
- Fix if necessary (insert a new avatar):  
  ```sql
  INSERT INTO BACKEND.AVATARS (RARITY, TYPE, ENERGY, LEVEL)
  VALUES ('COMMON', 'HUMAN', 100, 1)
  RETURNING ID;
  ```

---

### 🔥 **Final Checklist for User Object to be Returned**
✅ The user exists in `BACKEND.USERS`.  
✅ The user has a `NICKNAME` (not `NULL`).  
✅ The leaderboard exists in `BACKEND.LEADERBOARDS`.  
✅ If the leaderboard is **private**, the user is listed in `BACKEND.USERS_LEADERBOARDS`.  
✅ The user has activity logged in `BACKEND.ACTIVITY` within the leaderboard's timeframe.  
✅ The user has a valid `FAVORITE_AVATAR_ID`.  
✅ The favorite avatar exists in `BACKEND.AVATARS`.  

🚀 Run through these checks, and you should always get the expected user object!
