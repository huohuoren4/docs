# How to set up bash completion {#how-to-set-up-bash-completion}

When using bash as your shell, `pytest` can use argcomplete (<https://kislyuk.github.io/argcomplete/>) for auto-completion. For this `argcomplete` needs to be installed and enabled.

Install argcomplete using:

```shell
sudo pip install 'argcomplete>=0.5.7'
```

For global activation of all argcomplete enabled python applications run:

```shell
sudo activate-global-python-argcomplete
```

For permanent (but not global) `pytest` activation, use:

```shell
register-python-argcomplete pytest >> ~/.bashrc
```

For one-time activation of `argcomplete` for `pytest` only, use:

```shell
eval "$(register-python-argcomplete pytest)"
```