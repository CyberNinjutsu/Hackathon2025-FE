import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Lấy từ local storage theo key
      const item = window.localStorage.getItem(key);
      // Parse stored json hoặc nếu không có thì return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Nếu có lỗi thì return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return một wrapped version của useState's setter function
  // mà sẽ persist giá trị mới vào localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép value là một function để có cùng API như useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Lưu vào state
      setStoredValue(valueToStore);
      // Lưu vào local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Một implementation nâng cao hơn sẽ handle error case
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook chuyên dụng cho userPublicKey
export function useUserPublicKey() {
  const [userPublicKey, setUserPublicKey] = useLocalStorage<string | null>(
    "userPublicKey",
    null
  );

  // Tự động lưu publicKey vào localStorage khi có thay đổi
  const savePublicKey = (publicKey: string | null) => {
    setUserPublicKey(publicKey);
  };

  // Lấy publicKey từ localStorage
  const getPublicKey = () => {
    return userPublicKey;
  };

  // Xóa publicKey khỏi localStorage
  const clearPublicKey = () => {
    setUserPublicKey(null);
  };

  return {
    userPublicKey,
    savePublicKey,
    getPublicKey,
    clearPublicKey,
  };
}
