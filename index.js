const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const dotenv = require('dotenv'); 
dotenv.config();

const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
}

if (process.env.TOKEN == null) {
    console.log("An discord token is empty.");
    sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    return 0;
}

const discordLogin = async() => {
    try {
        await client.login(process.env.TOKEN);  
    } catch (TOKEN_INVALID) {
        console.log("An invalid token was provided");
        sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    }
}


discordLogin();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
});

  
client.on('messageCreate', msg => {

    try { 
        if (msg.content === process.env.PREFIX + 'call') msg.channel.send(`!callback`);

        if (msg.content === process.env.PREFIX + 'avatar') msg.channel.send(msg.author.displayAvatarURL());
        
        if(msg.content === process.env.PREFIX + 'help') {
            const embed = new Discord.MessageEmbed()
            .setTitle("도움말")
            .setColor('000') 
            .setDescription('디스코드봇 테스트입니다.');

            msg.reply({ embeds: [embed] })
        }

        if(msg.content === process.env.PREFIX + 'server') {
            msg.channel.send(`현재 서버의 이름은 ${msg.guild.name} 입니다.\n총 멤버 수는 ${msg.guild.memberCount} 명 입니다.`)
          }

        console.log(msg.content)
    } catch (e) {
        console.log(e);
    }
    
});

client.on('voiceStateUpdate', async (newState, oldState) => {
    const channel = newState.guild.channels.cache.find(c => c.name === "자유음성채널생성");
    if (newState.member.voice.channel) {
        if (!channel) return
        if (newState.member.voice.channel.id !== channel.id) return
        newState.guild.channels.create(`${newState.member.user.username}의 음성방`, {
            type: "GUILD_VOICE",
            parent: oldState.channel.parent
        }).then(ch => {
            if (!ch) return
            newState.member.voice.setChannel(ch)
            const interval = setInterval(() => {
                if (ch.deleted == true) {
                    clearInterval(interval)
                    return;
                }
                if (ch.members.size == 0) {
                    ch.delete()
                    console.log("채널 삭제됨")
                    return;
                }
            }, 5000);
        })
    }
})
