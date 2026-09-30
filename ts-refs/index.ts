import * as esc from "@pulumi/esc-sdk";
import * as pulumi from "@pulumi/pulumi";

const org = pulumi.getOrganization();
const config = new pulumi.Config();

// A stack reference whose name is a literal in the program.
const network = new pulumi.StackReference("boris-test1-pulumi-com-org/perm-network/prod");

// A stack reference whose name is only known at runtime.
const secrets = new pulumi.StackReference("secrets", { name: `${org}/perm-secrets/${pulumi.getStack()}` });

// An environment opened from program code rather than from the stack's config. No error handling:
// if the environment cannot be opened, the program fails.
async function openProgramOnlyEnvironment(): Promise<string> {
    // DefaultClient uses PULUMI_BACKEND_URL verbatim as the ESC API base path, which needs /api/esc.
    const client = esc.DefaultClient(new esc.Configuration({ basePath: `${process.env.PULUMI_BACKEND_URL}/api/esc` }));
    const env = await client.openAndReadEnvironment(org, "perm-demo", "program-only");
    return String(env?.values?.greeting);
}

export const region = config.require("region"); // from perm-demo/prod-config
export const vpcId = network.getOutput("vpcId");
export const dbPassword = network.getOutput("dbPassword");
export const endpoint = secrets.getOutput("endpoint");
export const token = secrets.getOutput("token");
export const greeting = pulumi.output(openProgramOnlyEnvironment());
