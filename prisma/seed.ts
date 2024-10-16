import { PrismaClient } from "@prisma/client";
import { User, Commit } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user: User = await prisma.user.create({
    data: {
      githubId: 28717686,
      username: "thatbeautifuldream",
      name: "Milind Mishra",
      avatarUrl: "https://avatars.githubusercontent.com/u/28717686?v=4",
      bio: "Building better web experiences ✨\r\n",
      location: "Bangalore, India",
      email: "milind.mishra4@gmail.com",
      publicRepos: 249,
      followers: 346,
      following: 762,
      createdAt: new Date("2017-05-15T22:20:39Z"),
      updatedAt: new Date("2024-10-01T01:41:27Z"),
      totalCommits: 10,
      lastCommitAt: new Date("2024-10-13T01:59:01Z"),
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // @ts-expect-error : id is auto-generated
  const commits: Omit<Commit, "id">[] = await prisma.commit.createMany({
    data: [
      {
        sha: "ed5af8702257130c6411257d4ad95b7360253199",
        message: "feat: kamal init",
        createdAt: new Date("2024-10-13T01:59:01Z"),
        repoName: "thatbeautifuldream/next-kamal-deploy",
        userId: user.id,
      },
      {
        sha: "53ef8a008e8a2265ca65f9f24f314254fdb8e4f9",
        message: "update script",
        createdAt: new Date("2024-10-13T01:36:26Z"),
        repoName: "thatbeautifuldream/ufw-setup",
        userId: user.id,
      },
      {
        sha: "27eb47abdd674189bc63a33d131191c23fb4c22d",
        message: "feat: update patch",
        createdAt: new Date("2024-10-12T22:25:01Z"),
        repoName: "thatbeautifuldream/milindmishra",
        userId: user.id,
      },
    ],
  });

  console.log(`Created ${commits.length} commits for user ${user.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
