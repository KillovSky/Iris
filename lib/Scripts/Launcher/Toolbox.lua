-- Define se é Windows
local is_windows = os.getenv("OS") == "Windows_NT"

-- Obtém o diretório atual compatível com o sistema operacional
function get_current_directory()
    if is_windows then
        local handle = io.popen("cd")
        local current_dir = handle:read("*a")
        handle:close()
        return current_dir:sub(1, -2)
    else
        return os.getenv("PWD")
    end
end

-- Define a função start_toolbox
function start_toolbox()
    -- Obtém o diretório atual absoluto
    local current_dir = get_current_directory()
    local script_dir

    -- Se o diretório atual contiver "/lib/Scripts", remove essa parte
    if string.match(current_dir, "/lib/Scripts") or string.match(current_dir, "\\lib\\Scripts") then
        -- Define a path do script como dois diretórios acima
        script_dir = current_dir:match("(.*)[/\\].*[/\\].*")
    else
        -- Caso contrário, define a path do script como o diretório atual
        script_dir = current_dir
    end

    -- Executa o script com base no sistema operacional
    if os.getenv("OS") == "Windows_NT" then
        -- Executa o script usando o CMD
        os.execute("cmd /c " .. script_dir .. "\\lib\\Scripts\\Toolbox.cmd")
    else
        -- Executa o script usando o Bash
        print("Comando a ser executado:", "bash " .. script_dir .. "/lib/Scripts/Toolbox.sh")
        os.execute("bash " .. script_dir .. "/lib/Scripts/Toolbox.sh")
    end
end

-- Chama a função start_toolbox se o script for executado como principal
if arg then
    start_toolbox()
end
