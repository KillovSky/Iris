Option Explicit

' Define a função para adicionar aspas extras aos caminhos com espaços
Function quote(str)
    quote = Chr(34) & str & Chr(34)
End Function

' Define as variáveis
Dim objShell, GIT_PATH, BASH_PATH, retVal, objFSO, currentDir, scriptPath

' Inicializa as variáveis do objeto
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")

' Define os diretórios atuais
currentDir = objFSO.GetAbsolutePathName(".")

' Verifica se o caminho atual contém "/lib/Scripts"
If InStr(1, objFSO.GetAbsolutePathName("."), "\lib\Scripts", vbTextCompare) > 0 Then
    ' Se sim, volta dois caminhos
    currentDir = objFSO.GetParentFolderName(objFSO.GetParentFolderName(objFSO.GetAbsolutePathName(".")))
Else
    ' Caso contrário, define o diretório atual
    currentDir = objFSO.GetAbsolutePathName(".")
End If

' Define o local do script
scriptPath = "./lib/Scripts/Toolbox.sh"

' Encontra o caminho do git.exe
GIT_PATH = objShell.Exec("where git.exe").StdOut.ReadAll()

' Se não encontrar o local
If GIT_PATH = "" Then
    WScript.Echo "Falha ao encontrar o caminho do git.exe."
    TryAlternative
End If

' Converte o caminho para apontar para o bash.exe
BASH_PATH = Replace(GIT_PATH, "cmd\git.exe", "bin\bash.exe")

' Imprime o inicio da tentativa
WScript.Echo "Tentando iniciar de modo normal..."

' Define o comando a ser executado
Dim command
command = Replace(Replace(Replace(quote(BASH_PATH) & " -c " & quote(Replace(scriptPath, "\", "\\")), vbCrLf, ""), vbCr, ""), vbLf, "")

' Define o diretório de trabalho para o diretório atual
objShell.CurrentDirectory = currentDir

' Tenta iniciar o script no modo normal
retVal = objShell.Run("cmd /c " & quote(command), 1, True)

' Verifica se o modo normal foi bem-sucedido
If retVal = 0 Then
    WScript.Echo "Modo normal concluido com sucesso."
    WScript.Quit
End If

' Define a forma alternativa
Sub TryAlternative()
    ' Avisa que o modo original falhou
    WScript.Echo "Modo normal falhou ou finalizou, usando modo alternativo em 5 segundos..."
    WScript.Sleep 5000

    ' Define o comando a ser executado
    Dim command
    command = Replace(Replace(Replace(quote("bash.exe") & " -c " & quote(Replace(scriptPath, "\", "\\")), vbCrLf, ""), vbCr, ""), vbLf, "")

    ' Tenta iniciar o script no modo alternativo
    retVal = objShell.Run("cmd /c " & quote(command), 1, True)

    ' Verifica se o modo alternativo foi bem-sucedido
    If retVal = 0 Then
        WScript.Echo "Modo alternativo concluido com sucesso."
        WScript.Quit
    Else
        ' Ambos os métodos falharam
        WScript.Echo "Modo alternativo e normal falharam ou terminaram..."
    End If

    ' Pede para sair
    WScript.Echo "Pressione qualquer tecla para sair..."
    WScript.StdIn.ReadLine()
    WScript.Quit
End Sub

' Tenta o meio alternativo
TryAlternative