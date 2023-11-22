import User from '../../users/user.entity';

export const mockedUser: User = {
    id: 1,
    email: 'user@email.com',
    name: 'John',
    password: 'hash',
    address: {
        id: 1,
        street: 'streetName',
        city: 'cityName',
        country: 'countryName',
    }
}

//on simule ici de fausse donnee pour un utilisateur afin de l'utiliser pour les tests