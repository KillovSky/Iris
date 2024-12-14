# pylint: disable=attribute-defined-outside-init,C0103
"""Programa que faz edições em arquivos JSONs"""
# Importa módulos
import json
import webbrowser
import copy
import tkinter as tk
from tkinter import filedialog, ttk, messagebox, simpledialog


# Define a classe do editor
class JSONEditorApp:
    """Define o aplicativo de edição"""

    # Define os códigos de inicio
    def __init__(self, master):
        """Inicializa a aplicação"""
        # Define a interface principal
        self.master = master
        self.master.title("JSON Explorer")

        # Define as variaveis base
        self.jsonData, self.isRawMode, self.openedJSON = None, None, None
        self.isPopup = False
        self.backupData = {}
        self.modifiedValues = {}
        self.deletions = {}
        self.addcodes = {}

        # Define as variáveis de cores
        self.isDark = False
        self.lightBG = "#f5f5f5"
        self.lightFG = "black"
        self.darkBG = "#121212"
        self.darkFG = "#ffffff"
        self.selectionBG = "#3366cc"
        self.selectionFG = "#ffffff"
        self.colorBG = self.darkBG if self.isDark else self.lightBG
        self.colorFG = self.lightFG if not self.isDark else self.darkFG

        # Cria funções iniciais
        self.create_widgets()

        # Insere um menu
        self.menucon = tk.Menu(self.master, tearoff=0)
        self.menucon.add_command(label="Add Key", command=self.addKeyFromPrompt)
        self.menucon.add_command(label="Delete Key", command=self.removeKeyFromJSON)
        self.menucon.add_command(label="Add to Array", command=self.addToJsonArray)

        # Ativa o dark mode ao iniciar
        self.changeTheme()

    def addToJsonArray(self):
        """Adiciona um novo valor a uma array no JSON"""
        # Obtém o caminho da array selecionada
        arrayPath = self.getPath()

        # Se o caminho é válido
        if arrayPath:
            # Obtém os valores da array
            arrayValues = self.getValues(arrayPath, self.jsonData)

            # Verifica se é uma array
            if isinstance(arrayValues, list):
                # Pede ao usuário para inserir o novo valor
                newValue = simpledialog.askstring("Novo Valor", "Insira o novo valor:")

                # Adiciona o novo valor à array
                arrayValues.append(newValue)

                # Atualiza a view
                self.reloadView(self.jsonData)

            # Se não for uma array
            else:
                messagebox.showerror("Erro", "O caminho selecionado não é uma array.")

        # Se nem houver um path
        else:
            messagebox.showinfo(
                "Info", "Selecione uma array para adicionar um novo valor."
            )

    def reloadView(self, jsonf):
        """Recarrega os dados da tree"""
        # Deleta os dados
        self.treeview.delete(*self.treeview.get_children())

        # Reinsere
        self.updateTreeView(jsonf)

    def changeTheme(self):
        """Executa o inicio da função de troca de temas"""
        self.isDark = not self.isDark
        self.colorBG = self.darkBG if self.isDark else self.lightBG
        self.colorFG = self.lightFG if not self.isDark else self.darkFG
        self.applyTheme()

    def applyTheme(self):
        """Aplica temas baseado na escolha do usuário"""
        # Define o estilo para a treeview
        style = ttk.Style()
        style.configure(
            "TLabel",
            background=self.colorBG,
            foreground=self.colorFG,
            fieldbackground=self.colorBG,
            selectbackground=self.selectionBG,
            selectforeground=self.selectionFG,
            insertbackground=self.colorFG,
        )

        # Aplica as cores aos elementos da interface
        self.master.config(bg=self.colorBG)
        self.valueArea.config(bg=self.colorBG)
        self.valuesLabel.config(bg=self.colorBG, fg=self.colorFG)
        self.menucon.config(bg=self.colorBG, fg=self.colorFG)
        self.treeview.config(style="TLabel")
        self.textValues.config(bg=self.colorBG, fg=self.colorFG)
        self.defaultValues.config(bg=self.colorBG, fg=self.colorFG)
        self.memoryValues.config(bg=self.colorBG, fg=self.colorFG)
        self.textValues.config(insertbackground=self.colorFG)

    def getPath(self):
        """Obtém o caminho completo do item no Treeview"""
        # Define o item selecionado
        getPlaces = self.treeview.selection()

        # Se houver um
        if getPlaces:
            # Obtém o primeiro
            getPlaces = getPlaces[0]

            # Define o path
            path = [self.treeview.item(getPlaces, "text")]

            # Verifica em loop o local até construir um tree válido
            while True:
                # Com base no parent da treeview
                tempItem = self.treeview.parent(getPlaces)

                # Se o if não for mais válido
                if not tempItem:
                    # Fecha o loop
                    break

                # Insere mais um path
                path.insert(0, self.treeview.item(tempItem, "text"))

                # Define o item como o path atual
                getPlaces = tempItem

            # Retorna o que receber
            return ".".join(path)

    def getValues(self, key, jsonf):
        """Obtém os valores de um local presente no JSON"""
        # Inicializa o primeiro valor
        jsonDisplay = jsonf

        # Define a path
        pathKeys = key.split(".")

        # Corrige o JSON com base na Path, Object
        for keyAcess in pathKeys:
            # Verifica se a key existe no nível atual
            if isinstance(jsonDisplay, dict):
                # Se for um dicionário, obtém o valor da key
                jsonDisplay = jsonDisplay.get(str(keyAcess), None)

            # Array
            elif isinstance(jsonDisplay, list):
                # Verifica se a key é um índice válido
                if keyAcess.isdigit() and 0 <= int(keyAcess) < len(jsonDisplay):
                    # Acessa o elemento correspondente na lista
                    jsonDisplay = jsonDisplay[int(keyAcess)]
                else:
                    # Se o índice não for válido, retorna None
                    return None

            # Outros
            else:
                # Retorna None (null)
                return None

        # Retorna o JSON
        return jsonDisplay

    def addKeyFromPrompt(self):
        """Pede ao usuário para inserir o nome e tipo da nova key"""
        # Se houver carregado um JSON
        if self.jsonData is not None:
            # Cria uma janela pop-up para obter o nome e tipo da nova Key
            popup = tk.Toplevel(self.master, bg=self.colorBG)
            popup.title("Adicionar Keys")

            # Adiciona o input de nome
            nameLabel = tk.Label(
                popup, text="Nome da Key:", bg=self.colorBG, fg=self.colorFG
            )
            nameLabel.grid(row=0, column=0, padx=5, pady=5)
            nameInput = tk.Entry(popup)
            nameInput.grid(row=0, column=1, padx=5, pady=5)

            # Adiciona o input de tipo
            typeLabel = tk.Label(
                popup, text="Tipo da Key:", bg=self.colorBG, fg=self.colorFG
            )
            typeLabel.grid(row=1, column=0, padx=5, pady=5)
            typeInput = ttk.Combobox(
                popup,
                values=[
                    "String (str)",
                    "Number (int, float)",
                    "Boolean (bool)",
                    "Array (list)",
                    "Object (dict)",
                ],
            )
            typeInput.grid(row=1, column=1, padx=5, pady=5)

            # Valor padrão
            typeInput.set("Object (dict)")

            # Insere o seletor de local
            placeLabel = tk.Label(
                popup, text="Inserir em:", bg=self.colorBG, fg=self.colorFG
            )
            placeLabel.grid(row=2, column=0, padx=5, pady=5)
            placeList = ttk.Combobox(popup, values=["Root", "Path"])
            placeList.set("Path")
            placeList.grid(row=2, column=1, padx=5, pady=5)

            # Insere o botão de confirmar
            addButton = tk.Button(
                popup,
                text="OK",
                command=lambda: self.addKeyFromPopup(
                    popup,
                    nameInput.get(),
                    typeInput.get(),
                    placeList.get(),
                ),
                bg=self.colorBG,
                fg=self.colorFG,
            )
            addButton.grid(row=3, column=0, columnspan=2, pady=10)

    def addKeyFromPopup(self, popup, name, etype, place):
        """Adiciona uma nova key ou elemento a um JSON e atualiza a Treeview"""
        # Define os valores padrões
        value = {
            "String (str)": "",
            "Number (int, float)": 0,
            "Boolean (bool)": False,
            "Array (list)": [],
            "Object (dict)": {},
        }[etype]

        # Define se vai aplicar na root
        if place == "Root":
            self.jsonData[name] = value
            self.addcodes[name] = value
            self.reloadView(self.jsonData)

        # Ou na path atual
        else:
            localOfKey = self.getPath()
            if isinstance(localOfKey, str):
                newData = self.getValues(localOfKey, self.jsonData)

                # Verifica se newData é uma lista ou um dicionário antes de tentar modificar
                if isinstance(newData, (list, dict)):
                    # Adiciona ao dicionário ou lista
                    newData[name] = value
                    self.addcodes[localOfKey] = value
                    self.reloadView(self.jsonData)

                # Se não tem path
                else:
                    messagebox.showerror(
                        "Erro", "Selecione uma path adequada para inserir!"
                    )

            # Se não for Object ou Array
            else:
                messagebox.showerror(
                    "Erro", "Esse local não suporta esse tipo de operação."
                )

        # Fecha a popup
        popup.destroy()

    def removeKeyFromJSON(self):
        """Remove a key selecionada"""
        # Obtém o Path
        removePath = self.getPath()

        # Se o path é válido
        if removePath:
            # Divide o path em partes
            pathKeys = removePath.split(".")

            # Obtém a referência do Object onde a key será removida
            parentDict = self.jsonData
            for key in pathKeys[:-1]:
                parentDict = parentDict[key]

            # Obtém a última parte do path (a key a ser removida)
            lastKey = pathKeys[-1]

            # Se a key existe
            if lastKey in parentDict:
                # Define nas deletions
                self.deletions[lastKey] = parentDict[lastKey]

                # Remove
                del parentDict[lastKey]

                # Atualiza a view
                self.reloadView(self.jsonData)

            # Se não existe
            else:
                messagebox.showinfo("Info", "A key selecionada não existe.")

        # Se não selecionou
        else:
            messagebox.showinfo("Info", "Você precisa selecionar uma key para remover!")

    def showContextMenu(self, event):
        """Exibe o menu de clique do botão direito do mouse"""
        self.menucon.post(event.x_root, event.y_root)

    def rawShowHide(self):
        """Exibe o JSON completo no valueArea"""
        # Se tiver carregado um JSON
        if self.jsonData is not None:
            # Se o RAW estiver ativo
            if self.isRawMode is True:
                # Salva alterações na memória
                self.jsonData = self.parseInput(self.textValues.get("1.0", tk.END))

                # Volta para a página branca padrão
                self.textValues.delete("1.0", tk.END)
                self.valuesLabel.config(text="Key: ")
                self.isRawMode = False

            # Se for para exibir
            else:
                # Mostra o JSON nos valores e define como RAW aberto
                self.isRawMode = True
                self.valuesLabel.config(text="RAW Mode")
                self.textValues.delete("1.0", tk.END)
                self.textValues.insert(
                    tk.END, json.dumps(self.jsonData, indent=2, ensure_ascii=False)
                )

        # Se ainda não tiver nenhum JSON
        else:
            messagebox.showinfo("Info", "Nenhum arquivo JSON carregado.")

    def saveData(self):
        """Salva valores editados na memoria e no jsonData"""
        # Se tiver um JSON aberto
        if self.jsonData is not None:
            # Define a path atual
            editPath = self.getPath()
            editedValue = self.textValues.get("1.0", tk.END)
            stockValue = self.getValues(editPath, self.backupData)

            # Tenta validar se o valor inserido é um JSON válido
            try:
                json.loads(editedValue)
            except json.JSONDecodeError:
                # Se não for válido, exibe uma mensagem e não salva
                messagebox.showerror(
                    "Erro", "O valor inserido não é válido para JSONs."
                )
                return

            # Se o valor for diferente
            if stockValue != editedValue:
                # Atualiza o valor na memória
                self.modifiedValues[editPath] = editedValue

                # Atualiza o valor em self.jsonData
                self.updateJsonData(editPath, editedValue)

                # Recarrega a treeview
                self.reloadView(self.jsonData)

    def updateJsonData(self, path, value):
        """Atualiza o valor em self.jsonData com base na path fornecida, lida com arrays também"""
        # Divide o path em partes
        pathKeys = path.split(".")

        # Obtém a referência do Object onde o valor será atualizado
        parent = self.jsonData
        for key in pathKeys[:-1]:
            if isinstance(parent, dict):
                parent = parent.get(key, None)
            elif isinstance(parent, list):
                try:
                    key = int(key)
                    parent = parent[key]
                except (ValueError, IndexError):
                    parent = None
            else:
                parent = None

        # Obtém a última parte do path (a key a ser atualizada)
        lastKey = pathKeys[-1]

        # Atualiza o valor em self.jsonData
        if isinstance(parent, dict):
            parent[lastKey] = self.parseInput(value)
        elif isinstance(parent, list):
            try:
                index = int(lastKey)
                parent[index] = self.parseInput(value)
            except (ValueError, IndexError):
                pass

    def showValues(self, event):
        """Exibe o valor selecionado no Treeview ou mostra JSON completo em raw"""
        # Se for o modo raw
        if event == "raw":
            # Define se exibe ou oculta ele
            self.rawShowHide()

        # Se for para exibir uma key
        elif self.jsonData is not None:
            # Define ela
            showKey = self.getPath()

            # Verifica se showKey não está vazia
            if showKey:
                # Inicializa o primeiro valor
                jsonDisplay = self.getValues(showKey, self.jsonData)

                # Se houver
                if jsonDisplay is not None:
                    # Define formatado como JSON
                    jsonDisplay = json.dumps(jsonDisplay, indent=2, ensure_ascii=False)

                    # Muda o label do editor
                    self.valuesLabel.config(text=f"Key: {showKey}")

                    # Deleta o 'padrão'
                    self.textValues.delete("1.0", tk.END)

                    # Adiciona o texto
                    self.textValues.insert(tk.END, jsonDisplay)

                    # Verifica se não está na raiz antes de acessar baseJSON
                    if "." in showKey:
                        # Lista de keys de ajuda
                        helpKeys = ["comment", "description", "help"]

                        # Usa a função getPath para obter a baseJSON
                        baseJSON = self.jsonData.get(
                            ".".join(showKey.split(".")[:-1]), {}
                        )

                        # Faz um loop com as keys de ajuda
                        for key in helpKeys:
                            # Se houver alguma
                            if isinstance(baseJSON, dict) and key in baseJSON:
                                # Muda no título
                                self.valuesLabel.config(
                                    text=f"{key.capitalize()}: {baseJSON[key]}\nKey: {showKey}"
                                )

                                # Para o loop
                                break

                    # Se fez edição antes
                    if showKey in self.modifiedValues:
                        # Deleta o valor
                        self.textValues.delete("1.0", tk.END)

                        # Insere o modificado
                        self.textValues.insert(tk.END, self.modifiedValues[showKey])

                # Se falhar em obter como JSON
                else:
                    messagebox.showinfo(
                        "Info", "A key selecionada não existe ou é incompatível."
                    )

            # Se não selecionou uma key
            else:
                messagebox.showinfo(
                    "Info", "Você precisa selecionar uma key para abrir!"
                )

    def createTreeView(self):
        """Cria o componente Treeview para exibir a estrutura do JSON"""
        # Define os detalhes e menus da treeview
        self.treeview = ttk.Treeview(self.master, show="tree")
        self.treeview.pack(side=tk.LEFT, expand=True, fill=tk.BOTH)
        self.treeview.bind("<ButtonRelease-1>", self.showValues)
        self.treeview.bind("<ButtonRelease-3>", self.showContextMenu)

    def create_widgets(self):
        """Cria os widgets da interface gráfica"""
        self.createMenu()
        self.createTreeView()
        self.createValueFrame()

    def createMenu(self):
        """Cria o menu na barra superior"""
        menubar = tk.Menu(self.master)
        menubar.add_command(label="Carregar", command=self.loadJSON)
        menubar.add_command(label="Salvar (Arquivo)", command=self.saveChangesToFile)
        menubar.add_checkbutton(label="RAW", command=self.rawShowHide)
        menubar.add_checkbutton(label="Reiniciar", command=self.restartEditor)
        menubar.add_command(label="Sobre", command=self.aboutPopup)
        menubar.add_command(label="Mudar Tema", command=self.changeTheme)
        self.master.config(menu=menubar)

    def restartEditor(self):
        """Reinicia o aplicativo"""
        # Destroi a janela atual
        self.master.destroy()

        # Cria uma nova instância do aplicativo JSONEditorApp
        new_root = tk.Tk()
        JSONEditorApp(new_root)
        new_root.mainloop()

    def onAboutClose(self):
        """Chamado quando a janela 'Sobre' é fechada"""
        # Se popup estiver ativo
        if self.isPopup is True:
            # Fecha e define como não ativo
            self.popupAbout.destroy()
            self.isPopup = False

    def openURL(self):
        """Abre a página do Projeto na GitHub"""
        webbrowser.open("https://KillovSky.github.io/", 1)

    def aboutPopup(self):
        """Exibe uma caixa de diálogo 'Sobre'"""
        # Se popup não estiver ativo
        if self.isPopup is False:
            # Define como ativo para evitar abrir muitos
            self.isPopup = True

            # Define a interface do popup
            self.popupAbout = tk.Toplevel(self.master, bg=self.colorBG)
            self.popupAbout.title("Sobre")

            # Define evento de fechar pelo X
            self.popupAbout.protocol("WM_DELETE_WINDOW", self.onAboutClose)

            # Define a mensagem
            labelAbout = tk.Label(
                self.popupAbout,
                text=(
                    "Um editor JSON simples, feito em Python usando a biblioteca Tkinter.\n\n"
                    + "Desenvolvido com ♡ por KillovSky ~ Lucas R.\n\n"
                    + "MIT License © 2023 KillovSky."
                ),
                bg=self.colorBG,
                fg=self.colorFG,
            )
            labelAbout.pack(padx=10, pady=10)

            # Define botão de GitHub para navegador
            githubButton = tk.Button(
                self.popupAbout,
                text="Projeto Íris",
                command=self.openURL,
                bg=self.colorBG,
                fg=self.colorFG,
            )
            githubButton.pack(pady=10)

    def clearEditor(self):
        """Limpa os valores da treeview, value e reseta os JSONs"""
        self.treeview.delete(*self.treeview.get_children())
        self.textValues.delete("1.0", tk.END)
        self.valuesLabel.config(text="Key: ")
        self.jsonData, self.openedJSON = None, None

    def titleRename(self):
        """Atualiza o título do aplicativo com o local do arquivo JSON e o estado de edição"""
        # Se tiver uma edição sendo feita
        if self.openedJSON is not None:
            # Define no titulo
            self.master.title(f"JSON Explorer ~ Editando: {self.openedJSON}")

    def loadJSON(self):
        """Carrega um arquivo JSON"""
        # Define o local do arquivo perguntando ao user
        fileLocation = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])

        # Se estiver OK
        if fileLocation:
            # Tenta abrir com try para caso não seja JSON realmente
            try:
                # Limpa o editor
                self.clearEditor()

                # Utiliza o with open para mais segurança
                with open(fileLocation, "r", encoding="utf-8") as file:
                    self.openedJSON, self.jsonData = fileLocation, json.load(file)

                # Insere o novo JSON
                self.updateTreeView(self.jsonData)

                # Insere o novo titulo
                self.titleRename()

                # Faz uma deepcopy do JSON
                self.backupData = copy.deepcopy(self.jsonData)

            # Se não conseguiu abrir, limpa e avisa sobre a falha
            except (json.JSONDecodeError, FileNotFoundError):
                messagebox.showerror(
                    "Erro", "O arquivo selecionado não contém um JSON válido."
                )
                self.clearEditor()

    def saveChangesToFile(self):
        """Salva as alterações no arquivo, se houver alguma alteração ou delete"""
        if self.modifiedValues or self.deletions or self.addcodes:
            # Try para caso der erros (geralmente má formatação)
            try:
                # Usa with open para um salvamento mais seguro
                with open(self.openedJSON, "w", encoding="utf-8") as file:
                    json.dump(self.jsonData, file, indent=2, ensure_ascii=False)

                # Mensagem de salvamento com sucesso
                messagebox.showinfo("Info", "Alterações salvas com sucesso!")

            # Se algo der errado
            except json.JSONDecodeError as e:
                # Printa o erro
                messagebox.showerror("Erro", f"Erro ao salvar as alterações: {str(e)}")

        # Se não tem nada pra salvar
        else:
            messagebox.showinfo("Info", "Nenhuma alteração para salvar.")

    def resetValues(self):
        """Redefine o valor da key para o valor original"""
        # Define o path
        currentPath = self.getPath()
        stockValue = self.getValues(currentPath, self.backupData)

        # Se houver
        if currentPath:
            # Reseta com base neles
            self.textValues.delete("1.0", tk.END)
            self.textValues.insert(
                tk.END, json.dumps(stockValue, indent=2, ensure_ascii=False)
            )

        # Se não tiver em uma path
        else:
            messagebox.showinfo("Info", "Nenhuma path para resetar foi selecionada.")

    def createValueFrame(self):
        """Cria o frame para exibir/editar valores"""
        # Cria a area de valores
        self.valueArea = tk.Frame(self.master, relief=tk.SUNKEN, bd=2)
        self.valueArea.pack(side=tk.RIGHT, expand=True, fill=tk.BOTH)

        # Define a label
        self.valuesLabel = tk.Label(
            self.valueArea, text="Key: ", anchor=tk.W, wraplength=500
        )
        self.valuesLabel.pack(fill=tk.X)

        # Define valores para o texto
        self.textValues = tk.Text(self.valueArea, wrap=tk.WORD, width=40, height=10)
        self.textValues.pack(fill=tk.BOTH, expand=True)

        # Define o botão de resetar
        self.defaultValues = tk.Button(
            self.valueArea, text="Default", command=self.resetValues
        )
        self.defaultValues.pack(fill=tk.X)

        # Define o botão de armanenar em memoria
        self.memoryValues = tk.Button(
            self.valueArea, text="Save (Memory)", command=self.saveData
        )
        self.memoryValues.pack(fill=tk.X)

    def updateTreeView(self, data, parent=""):
        """Preenche o componente Treeview com dados JSON"""
        # Se for Object
        if isinstance(data, dict):
            # Faz um loop para gerar as keys
            for key, value in data.items():
                # Define os valores
                item = self.treeview.insert(parent, "end", text=key)

                # Insere
                self.updateTreeView(value, item)

        # Se for uma array
        elif isinstance(data, list):
            # Faz um loop para gerar os index da Array
            for index, value in enumerate(data):
                # Define os dados
                item = self.treeview.insert(parent, "end", text=str(index))

                # Insere o valor
                self.updateTreeView(value, item)

    def parseInput(self, recinput):
        """Analisa a entrada (string) para obter um valor JSON"""
        # Tenta com try
        try:
            # Se deu certo é JSON
            return json.loads(recinput)

        # Se falhou
        except json.JSONDecodeError:
            # É outro
            return recinput


# Inicia o APP
if __name__ == "__main__":
    root = tk.Tk()
    JSONEditorApp(root)
    root.mainloop()
