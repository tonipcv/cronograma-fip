import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      enrollmentDate: Date;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    enrollmentDate: Date;
  }
} 