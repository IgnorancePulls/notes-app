interface Location {
    city: string;
    postcode: number;
    state: string;
    street: string;
}

export interface User {
    birthdate: number;
    email: string;
    first_name: string;
    gender: "male" | "female";
    last_name: string;
    location: Location;
    phone_number: string;
    title: string;
    username: string;
}
