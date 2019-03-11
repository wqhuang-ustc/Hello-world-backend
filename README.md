# Hello world backend
# Introduction
Backend will retrieve all sensor data hourly in a mongodb and write data into a cache file. Description of the source data and how data is updated can be found in [my another project](https://github.com/wqhuang-ustc/Eficode2019_task). <br/>
Backend offer two api for frontend: 
1. `/api/getUptime` provide the system uptime of the server.
2. `/api/updateData` read and process cache data file before send the data to frontend.
