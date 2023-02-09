"use strict";
const fs = require('fs');
const {
	mylang
} = require('../lang');
const {
	tools
} = require('./index');
var Prox_Msg = 0;
var botNumber = false;

/* Sistemas de verificação */
exports.init = async (k, m) => {

	/* JSON's */
	const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
	const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));
	const firewall = JSON.parse(fs.readFileSync('./lib/config/Settings/firewall.json'));

	/* Transforma as variáveis da exports em constantes */
	const kill = k;
	const message = m;

	/* Try Catch para evitar qualquer erro */
	try {

		/* Utilidades 1 */
		const isGroupMsg = message.isGroupMsg || false;
		const chatId = message.chatId || message.from || message.chat.contact.id || message.chat.groupMetadata.id || false;
		const type = message.type || false;
		botNumber = botNumber !== false ? botNumber : (await kill.getHostNumber()) + '@c.us';
		const user = message.author || message.sender.id || false;
		const fromMe = message.fromMe || false;
		const isOwner = config.Owner.includes(user);
		const groupAdmins = (isGroupMsg ? await kill.getGroupAdmins(chatId) : [config.Owner[0], botNumber]) || [config.Owner[0], botNumber];
		const isGroupAdmins = (groupAdmins ? groupAdmins.includes(user) : false) || false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false;

		/* Retorna se caso não tiver anti-travas ativado, Íris precisa ser ADM para funcionar */
		if (isGroupMsg && !functions.antitravas.includes(chatId) || type == 'ptt' || config.Check_Stickers == false && type == 'sticker' || !isBotGroupAdmins || isOwner || isGroupAdmins || fromMe || Object.keys(functions.vips[chatId] || []).includes(user) && config.VIP_Links == true) return true;

		/* Utilidades 2 [MSG] */
		const id = message.id || '';
		const body = message.body || '';
		const content = message.content || '';
		const caption = message.caption || '';
		const comment = message.comment || '';
		const matchedText = message.matchedText || '';
		const filename = message.filename || '';
		const footer = message.footer || '';
		const list = message.list || false;
		const name = message.chat.name || message.chat.formattedName || message.chat.contact.name || message.chat.contact.formattedName || '';
		const notifyName = message.sender.pushname || message.notifyName || false;
		var productListItemCount = message.productListItemCount || 0;
		const quotedMsg = message.quotedMsg !== null ? message.quotedMsg : (message.quotedMsgObj !== null ? message.quotedMsgObj : false);
		const quotedMsgObj = message.quotedMsgObj !== null ? message.quotedMsgObj : quotedMsg;
		const text = message.text || '';
		const stickerPack = (type == 'sticker' ? message.stickerPack || message.stickerPackName || message.mediaData.stickerPackName || '' : '') || '';
		const stickerAuthor = (type == 'sticker' ? message.stickerAuthor || message.stickerPackPublisher || message.mediaData.stickerPackPublisher || '' : '') || '';

		/* Utilidades secundarias */
		const quoted_user = (quotedMsgObj ? message.quotedParticipant || quotedMsgObj.author || quotedMsgObj.sender.id || false : false) || false;
		const isQuotedAdmin = (quotedMsgObj ? groupAdmins.includes(quoted_user) : false) || false;
		const isQuotedOwner = config.Owner.includes(quoted_user);
		const isQuotedMe = (quotedMsgObj ? quotedMsgObj.fromMe || quotedMsgObj.sender.isMe || quotedMsgObj.sender.id == botNumber : false) || false;
		const list_title = (list ? list.title : '' || '');
		const list_description = (list ? list.description : '' || '');
		const list_buttonText = (list ? list.buttonText : '' || '');
		const list_footerText = (list ? list.footerText : '' || '');
		const VCFs_Name = message.vcardList ? message.vcardList.map(g => g.displayName || '') : '';
		const VCFs_Content = message.vcardList ? message.vcardList.map(g => g.vcard || '') : '';
		const Quoted_Type = quotedMsgObj ? quotedMsgObj.type : false;
		const Quoted_matchedText = (quotedMsgObj ? (quotedMsgObj.matchedText ? quotedMsgObj.matchedText : '') : '') || '';
		const Quoted_notifyName = quotedMsgObj ? quotedMsgObj.sender.pushname || quotedMsgObj.notifyName || '' : '';
		const Quoted_VCFs_Name = (quotedMsgObj ? (quotedMsgObj.vcardList ? quotedMsgObj.vcardList.map(g => g.displayName || '') : '') : '') || '';
		const Quoted_VCFs_Content = (quotedMsgObj ? (quotedMsgObj.vcardList ? quotedMsgObj.vcardList.map(g => g.vcard || '') : '') : '') || '';
		const Quoted_Caption = (quotedMsgObj ? (quotedMsgObj.caption ? quotedMsgObj.caption : '') : '') || '';
		const Quoted_Body = (quotedMsgObj ? (quotedMsgObj.body ? quotedMsgObj.body : '') : '') || '';
		const Quoted_Footer = (quotedMsgObj ? (quotedMsgObj.footer ? quotedMsgObj.footer : '') : '') || '';
		const Quoted_Content = (quotedMsgObj ? (quotedMsgObj.content ? quotedMsgObj.content : '') : '') || '';
		const Quoted_Text = (quotedMsgObj ? (quotedMsgObj.text ? quotedMsgObj.text : '') : '') || '';
		const Quoted_list_title = (quotedMsgObj ? (quotedMsgObj.list ? quotedMsgObj.list.title : '') : '') || '';
		const Quoted_list_description = (quotedMsgObj ? (quotedMsgObj.list ? quotedMsgObj.description : '') : '') || '';
		const Quoted_list_buttonText = (quotedMsgObj ? (quotedMsgObj.list ? quotedMsgObj.buttonText : '') : '') || '';
		const Quoted_list_footerText = (quotedMsgObj ? (quotedMsgObj.list ? quotedMsgObj.footerText : '') : '') || '';
		const Quoted_stickerPack = (quotedMsgObj ? (quotedMsgObj.type == 'sticker' ? quotedMsgObj.stickerPack || quotedMsgObj.stickerPackName || quotedMsgObj.mediaData.stickerPackName || '' : '') : '') || '';
		const Quoted_stickerAuthor = (quotedMsgObj ? (quotedMsgObj.type == 'sticker' ? quotedMsgObj.stickerAuthor || quotedMsgObj.stickerPackPublisher || quotedMsgObj.mediaData.stickerPackPublisher || '' : '') : '') || '';
		var Message_Texts = [];
		var Quoted_Message_Texts = [];

		/* Message Values */
		Message_Texts = type == 'video' || type == 'image' || type == 'location' ? Message_Texts : Message_Texts.concat(body, content);
		Message_Texts = Message_Texts.concat(text, matchedText, footer, VCFs_Name, VCFs_Content, list_title, list_description, list_buttonText, list_footerText, caption, comment, filename);
		Message_Texts = config.Check_Stickers == true ? Message_Texts.concat(stickerAuthor, stickerPack) : Message_Texts;
		Message_Texts = config.Check_Nickname == true ? Message_Texts.concat(notifyName) : Message_Texts;

		/* Quoted Values */
		Quoted_Message_Texts = Quoted_Type == 'video' || Quoted_Type == 'image' || Quoted_Type == 'location' ? Quoted_Message_Texts : Message_Texts.concat(Quoted_Body, 	Quoted_Content);
		Quoted_Message_Texts = Message_Texts.concat(Quoted_Caption, Quoted_matchedText, Quoted_Footer, Quoted_VCFs_Name, Quoted_VCFs_Content, Quoted_Text, Quoted_list_title, Quoted_list_description, Quoted_list_buttonText, Quoted_list_footerText);
		Quoted_Message_Texts = config.Check_Stickers == true ? Quoted_Message_Texts.concat(Quoted_stickerPack, Quoted_stickerAuthor) : Quoted_Message_Texts;
		Quoted_Message_Texts = config.Check_Nickname == true ? Quoted_Message_Texts.concat(Quoted_notifyName) : Quoted_Message_Texts;

		/* Variáveis importantes */
		var Can_Continue = true;
		var needs_ban = false;
		var motive_ban = false;
		var banned = user;
		
		/* Sistema para caso tenha botões híbridos */
		if (Object.keys(message).includes('hydratedButtons')) {
			if (message.hydratedButtons.length > 0) {
				let Special_Buttons_URL = message.hydratedButtons.filter(g => Object.keys(g).includes('urlButton'));
				let Special_Buttons_Call = message.hydratedButtons.filter(g => Object.keys(g).includes('callButton'));
				let Special_Buttons_Quick = message.hydratedButtons.filter(g => Object.keys(g).includes('quickReplyButton'));
				let Url_Button = Special_Buttons_URL.map(f => [f.urlButton.displayText, f.urlButton.url]);
				let Call_Button = Special_Buttons_Call.map(f => [f.callButton.displayText, f.callButton.phoneNumber]);
				let Quick_Button = Special_Buttons_Quick.map(f => [f.quickReplyButton.displayText, f.quickReplyButton.id]);
				Message_Texts = Message_Texts.concat(Url_Button, Call_Button, Quick_Button).flat();
			}
		}
		
		/* Sistema para caso tenha marcado botões híbridos */
		if (quotedMsgObj) {
			if (Object.keys(quotedMsgObj).includes('hydratedButtons')) {
				if (quotedMsgObj.hydratedButtons.length > 0) {
					let Quoted_SButtons_URL = quotedMsgObj.hydratedButtons.filter(g => Object.keys(g).includes('urlButton'));
					let Quoted_SButtons_Call = quotedMsgObj.hydratedButtons.filter(g => Object.keys(g).includes('callButton'));
					let Quoted_SButtons_Quick = quotedMsgObj.hydratedButtons.filter(g => Object.keys(g).includes('quickReplyButton'));
					let Quoted_UrlButton = Quoted_SButtons_URL.map(f => [f.urlButton.displayText, f.urlButton.url]);
					let Quoted_CallButton = Quoted_SButtons_Call.map(f => [f.callButton.displayText, f.callButton.phoneNumber]);
					let Quoted_QuickButton = Quoted_SButtons_Quick.map(f => [f.quickReplyButton.displayText, f.quickReplyButton.id]);
					Quoted_Message_Texts = Quoted_Message_Texts.concat(Quoted_UrlButton, Quoted_CallButton, Quoted_QuickButton).flat();
				}
			}
		}

		/* Caso tenha sessões em botões */
		if (list) {
			if (list.sections.length > 0) {
				productListItemCount = list.sections[0].rows.length;
				let row_ids = list.sections[0].rows.filter(j => j.rowId).map(r => r.rowId);
				let row_title = list.sections[0].rows.filter(j => j.title).map(r => r.title);
				let row_desc = list.sections[0].rows.filter(j => j.description).map(r => r.description);
				let row_caption = list.sections[0].title || '';
				Message_Texts = Message_Texts.concat(row_title, row_ids, row_caption, row_desc);
			}
		}

		/* Caso tenha sessões em mensagens marcadas */
		if (quotedMsgObj) {
			if (quotedMsgObj.list) {
				if (quotedMsgObj.list.sections.length > 0) {
					let Quoted_RowID = quotedMsgObj.list.sections[0].rows.filter(j => j.rowId).map(r => r.rowId);
					let Quoted_RowTitle = quotedMsgObj.list.sections[0].rows.filter(j => j.title).map(r => r.title);
					let Quoted_RowDesc = quotedMsgObj.list.sections[0].rows.filter(j => j.description).map(r => r.description);
					let Quoted_RowCaption = quotedMsgObj.list.sections[0].title || '';
					Quoted_Message_Texts = Quoted_Message_Texts.concat(Quoted_RowID, Quoted_RowTitle, Quoted_RowDesc, Quoted_RowCaption);
				}
			}
		}
		
		/* Corrige a Message_Texts */
		Message_Texts = ([...new Set(Message_Texts.filter(h => h !== '' && h !== null && h !== false))]).flat();
		Quoted_Message_Texts = ([...new Set(Quoted_Message_Texts.filter(h => h !== '' && h !== null && h !== false))]).flat();

		/* Não verifica dono, ADMS e BOT */
		if (!isOwner && !isGroupAdmins && !fromMe) {

			/* Switch para verificar somente o parâmetro da hora */
			switch (type) {

				/* Trava catálogo / lista / produto */
				case 'list':
					if (Message_Texts.some(j => j.length >= firewall.Max_Characters)) {
						needs_ban = true;
						motive_ban = 'Limite de caracteres em lista';
					} else if (productListItemCount > Number(firewall.Max_Product)) {
						needs_ban = true;
						motive_ban = 'Limite de produtos';
					}
					if (quotedMsgObj) {
						if (Quoted_Message_Texts.some(j => j.length >= firewall.Max_Characters)) {
							needs_ban = true;
							motive_ban = 'Marcação de possível trava em lista';
						}
					}
				break;

				/* Trava VCF única */
				case 'vcard':
					if (body.length > Number(firewall.Max_Vcard_Size)) {
						needs_ban = true;
						motive_ban = 'Limite de caracteres dentro do vCard [VCF]';
					}
					if (quotedMsgObj) {
						if (Quoted_Message_Texts.some(j => j.length >= firewall.Max_Characters)) {
							needs_ban = true;
							motive_ban = 'Marcação de possível trava';
						}
					}
				break;

				/* Trava VCF +1 */
				case 'multi_vcard':
					if (message.vcardList.length > Number(firewall.Max_Contacts)) {
						needs_ban = true;
						motive_ban = "Limite de vCard's [VCF] recebidos";
					} else {
						let VCF_Name = message.vcardList.map(g => g.displayName);
						let VCF_Content = message.vcardList.map(g => g.vcard);
						if (VCF_Name.some(j => j.length >= firewall.Max_Characters)) {
							needs_ban = true;
							motive_ban = 'Limite de caracteres em nomes de vCard [VCF]';
						} else if (VCF_Content.some(j => j.length >= firewall.Max_Characters)) {
							needs_ban = true;
							motive_ban = 'Limite de caracteres dentro do vCard [VCF]';
						}
					}
					if (quotedMsgObj) {
						if (Quoted_Message_Texts.some(j => j.length >= firewall.Max_Characters) && !isQuotedAdmin && !isQuotedMe && !isQuotedOwner) {
							needs_ban = true;
							motive_ban = 'Marcação de possível trava';
							banned = quoted_user;
						}
					}
				break;

				/* Trava documento */
				case 'document':
					if ([filename, caption, text].some(j => j.length >= Number(firewall.Max_Doc_Size))) {
						needs_ban = true;
						motive_ban = 'Limite de caracteres em documento';
					}
					if (quotedMsgObj) {
						if (Quoted_Message_Texts.some(j => j.length >= firewall.Max_Characters)) {
							needs_ban = true;
							motive_ban = 'Marcação de possível trava em lista';
						}
					}
				break;

				/* Travas que não precisam de especificação extra */
				case 'template_button_reply':
				case 'chat':
				case 'sticker':
				case 'location':
				case 'image':
				case 'video':
					if (Message_Texts.some(j => j.length >= firewall.Max_Characters)) {
						needs_ban = true;
						motive_ban = 'Limite de caracteres em um/a '+type;
					}
					if (quotedMsgObj) {
						if (Quoted_Message_Texts.some(j => j.length >= firewall.Max_Characters) && !isQuotedAdmin && !isQuotedMe && !isQuotedOwner) {
							needs_ban = true;
							motive_ban = 'Marcação de possível trava';
							banned = quoted_user;
						}
					}
				break;

				/* Trava desconhecida */
				case 'unknown':
				case 'oversized':
					needs_ban = true;
					motive_ban = 'Mensagem suspeita que não consigo ler';
				break;
				
			}
			
		}

		/* Bane a pessoa caso grupo */
		if (needs_ban) {
			Can_Continue = false;
			if (config.Show_Functions == true) {
				console.log(tools('others').color('[TRAVA]', 'red'), tools('others').color(`Possível trava recebida pelo → ${notifyName} - [${banned.replace('@c.us', '')}] no "${name || 'PV'}"...`, 'yellow'));
			}
			if (isGroupMsg && isBotGroupAdmins) {
				await kill.removeParticipant(chatId, banned);
				await kill.deleteMessage(chatId, id);
			}
			if (firewall.Block == true) {
				await kill.contactBlock(banned);
			}
		}

		/* Avisa o por que do banimento, uma vez por hora para casos de flood */
		if (needs_ban == true && Prox_Msg < Date.now()) {
			Prox_Msg = Number(Date.now()) + 3600000;
			if (isGroupMsg && isBotGroupAdmins) {
				var banInjust = mylang(region).baninjusto(banned) + motive_ban;
				banInjust = firewall.Mention_Admins == true ? banInjust + `.\n@${groupAdmins.join(' @').replace(/@c.us/gim, '')}` : banInjust;
				await kill.sendTextWithMentions(chatId, banInjust);
			} else await kill.sendText(config.Owner[0], mylang(region).recTrava(banned)).catch(async () => await kill.sendText(config.Secure_Group, mylang(region).recTrava(banned)));
		}

		/* Diz se pode executar como comando ou mensagem */
		return Can_Continue;

		/* Caso der erro não afeta o funcionamento */
	} catch (error) {
		if (config.Show_Error == true) {
			tools('others').reportConsole('ANTI-TRAVAS', error);
		}
		return true;
	}

};