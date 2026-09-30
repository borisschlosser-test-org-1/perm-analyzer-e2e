import pulumi
import pulumi_esc_sdk as esc

org = pulumi.get_organization()
stack = pulumi.get_stack()

# A stack reference whose name is only known at runtime.
network = pulumi.StackReference(f"{org}/perm-network/{stack}")
pulumi.export("vpcId", network.get_output("vpcId"))

# An environment opened from program code. The program tolerates a failure and carries on.
try:
    _, values, _ = esc.default_client().open_and_read_environment(org, "perm-demo", "program-only")
    pulumi.export("greeting", values.get("greeting"))
except Exception as e:  # noqa: BLE001
    pulumi.log.warn(f"could not open perm-demo/program-only: {e}")
    pulumi.export("greeting", None)

pulumi.export("extraFlag", pulumi.Config().get_bool("extraFlag"))  # from perm-demo/extra
