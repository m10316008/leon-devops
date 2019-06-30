-- in file prod_current.lua
local uri = "______UPSTREAM______/______BRAND______/prod_current.txt?tt=" .. os.time(os.date("!*t"))
ngx.log(ngx.ERR,'Download prod_current from ' .. uri)
local handle = io.popen("curl " .. uri)
local result = handle:read("*a")
ngx.log(ngx.ERR,'prod_current : ' .. result)
handle:close()

local _M = {}
function _M.current()
    return result
end

return _M