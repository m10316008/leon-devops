
local headers = ngx.req.get_headers()
local client_ip = ngx.var.remote_addr
if headers["cdn-src-ip"]~=nil then
    client_ip = headers["cdn-src-ip"]
elseif headers["cf-connecting-ip"]~=nil then
    client_ip = headers["cf-connecting-ip"]
elseif headers["x-forwarded-for"]~=nil then
    client_ip = headers["x-forwarded-for"]				
end
ngx.req.set_header("x-forwarded-for", client_ip)				
