# 圖片庫

## 功能

圖庫部分：

- 可上傳照片，檔案格式 JPG/PNG，上傳後完即可於圖庫中看到縮圖。
- 預覽圖(縮圖)為原始圖片壓縮過之非透明圖片。
- [ ] 一個 floating icon 依日期為最小單位顯示該行照片的檔案日期
- 可點擊縮圖看原始圖檔(支援透明圖層)。
- 原始圖檔瀏覽可左右滑動切換上下一張圖片。
- [ ] 瀏覽狀態下圖片預載前後兩張，左右滑動可見。
- [ ] 瀏覽狀態下顯示檔案名稱為檔名前 14 碼，yyyy/mm/dd hh:mm:ss
- 可刪除圖片，刪除後即不見於圖庫
- 單次載入最大 50 張圖片，超過的部分於滑動到最後一張(第 50 張)後繼續載入。

## 檔案說明

In static:

script.js -- 放置起始應用程式碼  
controls/ -- 對 API 發需求、存放資料，及互動控制的程式碼

- events.js -- 事件監聽的 callback
- handler.js -- 對 API 及使用者互動控制

views/ -- 跟切換畫面有關的應用

- DeletionPage.js -- 刪除功能的頁面
- ImageReader.js -- 瀏覽圖片的頁面

sytle.css -- app 全域的樣式設定

styles/ -- 個別元件及單一樣式化的設定

- basics.css -- 單一樣式化的設定
- components.css -- 個別元件的設定

## 運作模式

// TODO
