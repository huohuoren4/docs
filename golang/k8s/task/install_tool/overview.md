# Install Tools

## kubectl

The Kubernetes command-line tool, [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/), allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs. For more information including a complete list of kubectl operations, see the [kubectl reference documentation](https://kubernetes.io/docs/reference/kubectl/).

kubectl is installable on a variety of Linux platforms, macOS and Windows. Find your preferred operating system below.

- [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows)

[View kind Quick Start Guide](https://kind.sigs.k8s.io/docs/user/quick-start/)

## kind

[kind](https://kind.sigs.k8s.io/) lets you run Kubernetes on your local computer. This tool requires that you have either [Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed.

The kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page shows you what you need to do to get up and running with kind.


## minikube

Like kind, [minikube](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes locally. minikube runs an all-in-one or a multi-node local Kubernetes cluster on your personal computer (including Windows, macOS and Linux PCs) so that you can try out Kubernetes, or for daily development work.

You can follow the official [Get Started!](https://minikube.sigs.k8s.io/docs/start/) guide if your focus is on getting the tool installed.

[View minikube Get Started! Guide](https://minikube.sigs.k8s.io/docs/start/)

Once you have minikube working, you can use it to [run a sample application](https://kubernetes.io/docs/tutorials/hello-minikube/).

## kubeadm

You can use the [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) tool to create and manage Kubernetes clusters. It performs the actions necessary to get a minimum viable, secure cluster up and running in a user friendly way.

[Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) shows you how to install kubeadm. Once installed, you can use it to [create a cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

[View kubeadm Install Guide](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)


