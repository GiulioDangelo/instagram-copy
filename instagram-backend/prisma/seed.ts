import { Post, PrismaClient, Tag, User } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({}); 
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.$executeRaw`ALTER TABLE user AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE post AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE tag AUTO_INCREMENT = 1;`;


  const amountOfUsers = 100;

  const users: User[] = [];
  const posts: Post[] = [];
  const tags : Tag[] = [];

  for (let i = 0; i < amountOfUsers; i++) {

    const user:any = {
      firstname:  faker.person.firstName(),
      lastname:   faker.person.lastName(),
      username:   faker.internet.userName(),
      email:      faker.internet.email(),
      password:   faker.internet.password(),
      bio:        faker.lorem.paragraph().substring(0, 100),
      avatar:     faker.image.avatarGitHub(),
    };

    const post:any = {
      description : faker.lorem.paragraph().substring(0, 100),
      image       : faker.image.urlLoremFlickr({ category: 'random' }),
      likes       : faker.number.int({ min: 0, max: 21474 }),
      comments    : faker.number.int({ min: 0, max: 21474 }),
      authorId    : i + 1,
    };

    const tag:any = {
      name: "#" + faker.word.adjective({ length: { min: 4, max: 15 }}) + Math.floor(Math.random() * 20),
    };

    users.push(user);
    posts.push(post);
    tags.push(tag);
  }

  const addUsers = async () => await prisma.user.createMany({ data: users });
  const addPosts = async () => await prisma.post.createMany({ data: posts });
  const addTags = async () => await prisma.tag.createMany({ data: tags });

  await addUsers();
  await addPosts();
  await addTags();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });