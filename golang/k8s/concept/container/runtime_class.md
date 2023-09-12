# Runtime Class

*FEATURE STATE*: `Kubernetes v1.20 [stable]`
This page describes the RuntimeClass resource and runtime selection mechanism.

RuntimeClass is a feature for selecting the container runtime configuration. The container runtime configuration is used to run a Pod's containers.

## Motivation

You can set a different RuntimeClass between different Pods to provide a balance of performance versus security. For example, if part of your workload deserves a high level of information security assurance, you might choose to schedule those Pods so that they run in a container runtime that uses hardware virtualization. You'd then benefit from the extra isolation of the alternative runtime, at the expense of some additional overhead.

You can also use RuntimeClass to run different Pods with the same container runtime but with different settings.

## Setup

1. Configure the CRI implementation on nodes (runtime dependent)
2. Create the corresponding RuntimeClass resources

### 1. Configure the CRI implementation on nodes

The configurations available through RuntimeClass are Container Runtime Interface (CRI) implementation dependent. See the corresponding documentation ([below](https://kubernetes.io/docs/concepts/containers/runtime-class/#cri-configuration)) for your CRI implementation for how to configure.

::: tip Note: 
RuntimeClass assumes a homogeneous node configuration across the cluster by default (which means that all nodes are configured the same way with respect to container runtimes). To support heterogeneous node configurations, see [Scheduling](https://kubernetes.io/docs/concepts/containers/runtime-class/#scheduling) below.
:::

The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The handler must be a valid [DNS label name](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names).

### 2. Create the corresponding RuntimeClass resources

The configurations setup in step 1 should each have an associated `handler` name, which identifies the configuration. For each handler, create a corresponding RuntimeClass object.

The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name (`metadata.name`) and the handler (`handler`). The object definition looks like this:

```shell
# RuntimeClass is defined in the node.k8s.io API group
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # The name the RuntimeClass will be referenced by.
  # RuntimeClass is a non-namespaced resource.
  name: myclass 
# The name of the corresponding CRI configuration
handler: myconfiguration 
```

The name of a RuntimeClass object must be a valid [DNS subdomain name](https://kubernetes.io/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

::: tip Note: 
It is recommended that RuntimeClass write operations (create/update/patch/delete) be restricted to the cluster administrator. This is typically the default. See [Authorization Overview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/) for more details.
:::

## Usage

Once RuntimeClasses are configured for the cluster, you can specify a `runtimeClassName` in the Pod spec to use it. For example:

```shell
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

This will instruct the kubelet to use the named RuntimeClass to run this pod. If the named RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the `Failed` terminal [phase](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a corresponding [event](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) for an error message.

If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent to the behavior when the RuntimeClass feature is disabled.

### CRI Configuration

For more details on setting up CRI runtimes, see [CRI installation](https://kubernetes.io/docs/setup/production-environment/container-runtimes/).

#### containerd

Runtime handlers are configured through containerd's configuration at `/etc/containerd/config.toml`. Valid handlers are configured under the runtimes section:

```shell
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

See containerd's [config documentation](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) for more details:

#### CRI-O

Runtime handlers are configured through CRI-O's configuration at `/etc/crio/crio.conf`. Valid handlers are configured under the [crio.runtime table](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```shell
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

See CRI-O's [config documentation](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) for more details.

## Scheduling

*FEATURE STATE*: `Kubernetes v1.16 [beta]`

By specifying the `scheduling` field for a RuntimeClass, you can set constraints to ensure that Pods running with this RuntimeClass are scheduled to nodes that support it. If `scheduling` is not set, this RuntimeClass is assumed to be supported by all nodes.

To ensure pods land on nodes supporting a specific RuntimeClass, that set of nodes should have a common label which is then selected by the `runtimeclass.scheduling.nodeSelector` field. The RuntimeClass's nodeSelector is merged with the pod's nodeSelector in admission, effectively taking the intersection of the set of nodes selected by each. If there is a conflict, the pod will be rejected.

If the supported nodes are tainted to prevent other RuntimeClass pods from running on the node, you can add `tolerations` to the `RuntimeClass`. As with the `nodeSelector`, the tolerations are merged with the pod's tolerations in admission, effectively taking the union of the set of nodes tolerated by each.

To learn more about configuring the node selector and tolerations, see [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/).

### Pod Overhead

*FEATURE STATE*: `Kubernetes v1.24 [stable]`

You can specify overhead resources that are associated with running a Pod. Declaring overhead allows the cluster (including the scheduler) to account for it when making decisions about Pods and resources.

Pod overhead is defined in RuntimeClass through the `overhead` field. Through the use of this field, you can specify the overhead of running pods utilizing this RuntimeClass and ensure these overheads are accounted for in Kubernetes.

## What's next

- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- Read about the [Pod Overhead](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-overhead/) concept
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)