class PrismaClientRepositorie {
    async create(data) {
        const currentClient = await prisma.client.create({
            data: {
                name: data.name,
                cpf: data.cpf,
                email: data.email,
                password: data.password,
                client_avatar: data.client_avatar,
                nickname: data.nickname,
                phone: data.phone, // Certifique-se de incluir este campo
                address: data.address,
            }
        });
        return currentClient;
    }
}

export default PrismaClientRepositorie;