const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const ayarlar = require("./ayarlar/bot.json"); 
const db = require('quick.db');
const Gamedig = require('gamedig')
const odb = require("orio.db");
const request = ('request')
const disbut = require('discord-buttons')
disbut(client);
const embed = new Discord.MessageEmbed()  
const { Client, MessageEmbed, Collection, DiscordAPIError } = require("discord.js");

client.on("message", async message => {
  let prefix = await db.fetch(`prefix.${message.guild.id}`) || ayarlar.prefix 
const messageArray = message.content.split(" ");
const cmd = messageArray[0].toLowerCase();
const args = messageArray.slice(1);
if (!message.content.startsWith(prefix)) return;
const commandfile =
client.commands.get(cmd.slice(prefix.length)) ||
client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
if (commandfile) commandfile.run(client, message, args);
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();



fs.readdir("./komutlar/", (err, files) => {
const jsfiles = files.filter(f => f.split(".").pop() === "js");
if (jsfiles.length <= 0) {
return console.log("Herhangi bir komut bulunamadı!");
}
jsfiles.forEach(file => {
console.log(`Yüklenen Komut: ${file}`);
const command = require(`./komutlar/${file}`);
client.commands.set(command.config.name, command);
command.config.aliases.forEach(alias => {
client.aliases.set(alias, command.config.name);
});
});
});








//client.login(ayarlar.token)
client.login(ayarlar.token)
.then(function() {
console.log('Token doğru. Bot aktif ediliyor.')
}, function(err) {
console.log("Tokeniniz yanlış. Bot başlatılamıyor.")
setInterval(function() {
process.exit(0)
}, 20000);
})



///ticket
const renk = ayarlar.ticketembedrenk

client.on("ready", async () => {
setInterval(async () => {
  if (odb.get("csticket")) {
    Object.keys(odb.get("csticket")).map(async e => {
const odbdb = odb.get("csticket."+e)
      const sunucu = client.guilds.cache.get(odbdb.sunucuID);
      if (!sunucu) {
         odb.delete("csticket." + odbdb.sunucuID);
      } else {

        const kanal = sunucu.channels.cache.get(odbdb.kanal);
        if (!kanal) {
          let a = sunucu.channels.cache.find((xxx) => xxx.name === "DESTEK")
          if (a) {
            setTimeout(() => {
            sunucu.channels.cache.filter(cs => cs.parentID === a.id).map(cs => cs.delete().catch(() => {}))
            }, 5000)
            setTimeout(() => {
            a.delete().catch(() => {})
            }, 10000)
          }
          sunucu.owner.send("Ticket Sistemi İçin Ayarlanan **Ticket Kanalı** Bulunamadığı İçin Sistem Kapandı ve Bütün Destek Talepleri Silindi!").catch(() => {})
           odb.delete("csticket." + sunucu.id);
        } else {

  
          const db = await kanal.messages.fetch(odbdb.mesajID).catch((e) => {})
          if (!db) {
            let a = sunucu.channels.cache.find((xxx) => xxx.name === "DESTEK")
            if (a) {
              setTimeout(() => {
              sunucu.channels.cache.filter(cs => cs.parentID === a.id).map(cs => cs.delete().catch(() => {}))
              }, 5000)
              setTimeout(() => {
              a.delete().catch(() => {})
              }, 10000)
            }
            sunucu.owner.send("Ticket Sistemi İçin Ayarlanan **Ticket Mesajı** Bulunamadığı İçin Sistem Kapandı ve Bütün Destek Talepleri Silindi!").catch(() => {})
             odb.delete("csticket." + sunucu.id);
          } else {
return
          }
        }
      }
    });
  }
}, 5000)
});

client.on("clickButton", async (button) => {
  let member = button.message.guild.members.cache.get(button.clicker.user.id);
 
  if (!member.user.bot) {
    const db = odb.get("csticket." + button.message.guild.id);
    if (db) {
      let listedChannels = []
      const csguild = button.message.guild
      let csrol = csguild.roles.cache.get(db.rolID)
      if(csrol){
      let onl;
      csguild.members.cache.forEach(async p => {
        if (p.roles.cache.has(csrol.id)) {
          if(csguild.members.cache.get(p.id).user.presence.status === "idle") onl = ":orange_circle:";
          if(csguild.members.cache.get(p.id).user.presence.status === "dnd") onl = ":red_circle:";
          if(csguild.members.cache.get(p.id).user.presence.status === "online") onl = ":green_circle:";
          if(csguild.members.cache.get(p.id).user.presence.status === "offline") onl = ":white_circle:";

          listedChannels.push(`\`${p.user.tag}` + "` " + onl);
        }
      });
      if (db.mesajID === button.message.id) {
        if (button.id === "dcsticket") {
          button.reply.think(true).then(async msj => {
            originm = member
            if(!csguild.channels.cache.find((xx) => xx.name === "DESTEK")) {
              await csguild.channels.create(`DESTEK`, {
                type: "category",
              }).catch(() => {})
            }
            let a = await csguild.channels.cache.find((xxx) => xxx.name === "DESTEK");
            if(csguild.channels.cache.some((kk) => kk.name === `destek-${csguild.members.cache.get(member.id).user.username.toLowerCase() + csguild.members.cache.get(member.id).user.discriminator}`) == true)
              return msj.edit(`**Destek Sistemi Açma İşlemi Başarısız!\nSebep: \`Açılmış Zaten 1 Tane Destek Talebiniz Var.\`**`, true).catch(() => {})
          csguild.channels.create(`destek-${member.user.tag}`).then(async (c)=> {
                if(a){
                  c.setParent(a).catch(() => {})
                }
            
                setTimeout(async() => {
                  const csrole = csguild.roles.cache.get(db.rolID)
                  await c.createOverwrite(csrole, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                  }).catch(() => {})
           const csrole2 = csguild.roles.cache.find((r) => r.name === "@everyone")
                await c.createOverwrite(csrole2,{
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false
                  }).catch(() => {})

                await c.createOverwrite(member, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
                  READ_MESSAGE_HISTORY: true
                }).catch(() => {})
              }, 2000)
                msj.edit(`Destek kanalın başarıyla oluşturuldu. **Kanal:** ${c}`,true).catch(() => {})
                let button = new disbut.MessageButton()
                .setLabel("Talebi Kapat")
                .setStyle("red")
                .setID("dcsticketsil");

                 c.send({
                  embed: new Discord.MessageEmbed() 
                  .setColor(`${renk}`)
                  .setAuthor(`${client.user.username} | Destek Sistemi`)
                  .addField(
                    `Merhaba ${member.user.username}!`,
                    `Destek Yetkilileri Burada Seninle İlgilenecektir!\nDestek Talebini Kapatmak İçin \`Talebi Kapat\` Butonuna Tıklaya Bilirsiniz!`
                  )
                  .addField(`» Kullanıcı:`, `<@${member.user.id}>`)
                  .addField(
                    `**Destek Rolündeki Yetkililer;**`,
                    `${listedChannels.join(`\n`) || "KİMSE YOK"}`
                  )
                  .setFooter(`${client.user.username} | Destek Sistemi`)
                  .setTimestamp(),button: button}).then(async csmesaj => {
                    c.send("<@"+member.id+"> | <@&"+csrol+">")
            await odb.set(csguild.id+"-"+c.id, csmesaj.id)
            await odb.set(csguild.id+"-"+c.id+"-"+c.id, member.user.tag)
                }).catch(() => {})
          }).catch(() => {})
    
        })
        }
      }

      if(button.id === "dcsticketsil"){
        button.reply.think(true).then(async msj => {
const mesajdb = odb.get(button.message.guild.id+"-"+button.message.channel.id)
if(mesajdb){
  const mesajdb2 = await button.message.channel.messages.fetch(mesajdb)
  if(mesajdb2){

    let button = new disbut.MessageButton()
    .setLabel("İptal Et")
    .setStyle("red")
    .setID("dcsticketsil2")

    let button2 = new disbut.MessageButton()
    .setLabel("Talebi Kapat")
    .setStyle("green")
    .setID("dcsticketsil3")

    msj.edit(`Destek talebini kapatmak için **"Talebi Kapat"** yazan butona, kapatmamak için **"İptal Et"** yazan butona basınız.`, true).catch(() => {})
    mesajdb2.edit({
      embed: new Discord.MessageEmbed()
      .setColor(`${renk}`)
      .setAuthor(`${client.user.username} | Destek Sistemi`)
      .addField(
        `Merhaba ${member.user.username}!`,
        `Destek Yetkilileri Burada Seninle İlgilenecektir!\nDestek Talebini Kapatmak İçin \`Talebi Kapat\` Butonuna Tıklaya Bilirsiniz!`)
      .addField(`» Kullanıcı:`, `<@${member.user.id}>`)
      .addField(
        `**Destek Rolündeki Yetkililer;**`,
        `${listedChannels.join(`\n`) || "KİMSE YOK"}`)
      .setFooter(`${client.user.username} | Destek Sistemi`)
      .setTimestamp(),button: [button2, button]}).catch(() => {})
    
  }
}
        })
      }


      if(button.id === "dcsticketsil2"){
        button.reply.think(true).then(async msj => {
        const mesajdb = odb.get(button.message.guild.id+"-"+button.message.channel.id)
        if(mesajdb){
          const mesajdb2 = await button.message.channel.messages.fetch(mesajdb)
          if(mesajdb2){
            
            let button = new disbut.MessageButton()
            .setLabel("Talebi Kapat")
            .setStyle("red")
            .setID("dcsticketsil");

            msj.edit(`Destek talebini kapatma işlemi iptal edildi.`, true).catch(() => {})
            mesajdb2.edit({
              embed: new Discord.MessageEmbed() 
              .setColor(`${renk}`)
              .setAuthor(`${client.user.username} | Destek Sistemi`)
              .addField(
                `Merhaba ${member.user.username}!`,
                `Destek Yetkilileri Burada Seninle İlgilenecektir!\nDestek Talebini Kapatmak İçin \`Talebi Kapat\` Butonuna Tıklaya Bilirsiniz!`)
              .addField(`» Kullanıcı:`, `<@${member.user.id}>`)
              .addField(
                `**Destek Rolündeki Yetkililer;**`,
                `${listedChannels.join(`\n`) || "KİMSE YOK"}`)
              .setFooter(`${client.user.username} | Destek Sistemi`)
              .setTimestamp(),button: [button]}).catch(() => {})
            
          }
        }
      })
              }

              if(button.id === "dcsticketsil3"){
                button.reply.think(true).then(async msj => {
                const mesajdb = odb.get(button.message.guild.id+"-"+button.message.channel.id)
                if(mesajdb){
                  const mesajdb2 = await button.message.channel.messages.fetch(mesajdb)
                  if(mesajdb2){

                    msj.edit(`Destek talebiniz kapatılıyor, Lütfen bekleyin...`, true).catch(() => {})
            const dbdd = odb.get(csguild.id+"-"+button.message.channel.id+"-"+button.message.channel.id) || member.user.tag
                    setTimeout(async () => {
                    await button.message.channel.createOverwrite(member, {
                      SEND_MESSAGES: false,
                      VIEW_CHANNEL: false
                    }).catch(() => {})
                    await button.message.channel.setName("kapalı-"+dbdd).catch(() => {})
                    await odb.delete(csguild.id+"-"+button.message.channel.id+"-"+button.message.channel.id)
                  }, 3000)
                  setTimeout(async () => {
                    let button = new disbut.MessageButton()
                    .setLabel("Talebi Temizle")
                    .setStyle("green")
                    .setID("dcstickettemizle");
    
                    mesajdb2.edit({
                      embed: new Discord.MessageEmbed() 
                      .setColor(`${renk}`)
                      .setAuthor(`${client.user.username} | Destek Sistemi`)  
                      .addField(`Kullanıcı:`, `<@${member.user.id}> (\`${member.user.id}\`)`)
                      .addField("Talep Kapatıldı", "Bu Destek Talebi, Kullanıcı Tarafından Kapatıldı. Tamamen Silmek İçin **'Talebi Temizle'** İsimli Butona Tıklayınız! \n \n **Sizin ile ilgilenen yetkiliye puan vermek için: <#977906962404630538> odasına \n .beğen @yetkili <0-10 Arası Puanınız>**")
                      .setFooter(`${client.user.username} | Destek Sistemi`)
                      .setTimestamp(),button: [button]}).catch(() => {})
                  }, 6000)
                }
                }
              })
                      }


                      if(button.id === "dcstickettemizle"){
                        button.reply.think(true).then(async msj => {
                        const mesajdb = odb.get(button.message.guild.id+"-"+button.message.channel.id)
                        if(mesajdb){
                          const mesajdb2 = await button.message.channel.messages.fetch(mesajdb)
                          if(mesajdb2){
                            const mem2 = csguild.members.cache.get(button.clicker.user.id)
                            if(mem2.roles.cache.has(csrol.id)){
                            msj.edit(`Destek talebi 5 saniye sonra tamamen temizlenecektir.`, true).catch(() => {})
     
                          setTimeout(async () => {
                          await button.message.channel.delete().catch(() => {})
                          await odb.delete(button.message.guild.id+"-"+button.message.channel.id)
                          await odb.delete("mesajsize-"+button.message.channel.id+"-"+button.message.guild.id)
                          await odb.delete(csguild.id+"-"+button.message.channel.id+"-"+button.message.channel.id)
                          }, 5000)
                            } 
                        }
                        }
                      })
                              }

    } else {
      button.reply.think(true).then(async msj => {
        const cdguild2 = button.message.guild
        const db = odb.get("csticket." + cdguild2.id);
        const sunucu = client.guilds.cache.get(db.sunucuID);
        if (!sunucu) {
          odb.delete("csticket." + db.sunucuID);
        } else {
          const kanal = sunucu.channels.cache.get(db.kanal);
          if (!kanal) {
            odb.delete("csticket." + db.sunucuID);
          } else {
            const db2 = kanal.messages.fetch(db.mesajID);
            if (!db2) {
              odb.delete("csticket." + db.sunucuID);
            } else {
              db2.then((mr) => mr.delete().catch(() => {})).catch((e) => {});
        msj.edit("Bu sunucuda ayarlanan destek yetkilisi rolünü bulamadım bu yüzden sistem kapandı!").catch(() => {})
        let a = button.message.guild.channels.cache.find((xxx) => xxx.name === "DESTEK")
        if (a) {
          setTimeout(() => {
          button.message.guild.channels.cache.filter(cs => cs.parentID === a.id).map(cs => cs.delete().catch(() => {}))
          }, 5000)
          setTimeout(() => {
          a.delete().catch(() => {})
          }, 10000)
        }
        button.message.guild.owner.send("Ticket Sistemi İçin Ayarlanan **Yetkili Rolü** Bulunamadığı İçin Sistem Kapandı ve Bütün Destek Talepleri Silindi!").catch(() => {})
      await odb.delete("csticket." + button.message.guild.id);
            }}}
      })
    }
  }
} 
});

client.on("message", async message => {
  if(message.guild){
  const db = odb.get("csticket." + message.guild.id);
  if(db){
  if(db.kanal === message.channel.id){
  if(!message.member.hasPermission("MANAGE_GUILD")){
    await message.delete().catch(() => {})
}}}
  }
});

client.on("message", async message => {
  if(message.guild){
    if(odb.get("csticket." + message.guild.id)){
      if(message.channel.name.includes("destek-")){
        await odb.add("mesajsize-"+message.channel.id+"-"+message.guild.id, 1)
        const db = odb.get("mesajsize-"+message.channel.id+"-"+message.guild.id)
        if(db){
          if(db > 50){
 await odb.delete("mesajsize-"+message.channel.id+"-"+message.guild.id)

            let button = new disbut.MessageButton()
            .setLabel("Talebi Kapat")
            .setStyle("red")
            .setID("dcsticketsil")

            message.channel.send({
              embed: new Discord.MessageEmbed() 
              .setColor(`${renk}`)
              .setAuthor(`${client.user.username} | Destek Sistemi`)
              .setDescription("Hey Bu Talepte İşin Bittimi? Kapatmak İçin Aşşağıdaki **'Talebi Kapat'** İsimli Butona Tıklaya Bilirsin!")
              .setFooter(`${client.user.username} | Destek Sistemi`)
              .setTimestamp(),button: button}).then(msj => {
                 odb.set(message.guild.id+"-"+message.channel.id, msj.id)
              })
          }
        }
      }
    }
  }
})
///ticket



