#!/usr/bin/env bash
# Permanently allow non-root users to bind to ports below 1024 (like 80)

if [ "$EUID" -ne 0 ]; then
  echo "Please run this script once with sudo (it will make the change permanent)."
  exit 1
fi

sysctl -w net.ipv4.ip_unprivileged_port_start=0
grep -q '^net.ipv4.ip_unprivileged_port_start' /etc/sysctl.conf \
  && sed -i 's/^net.ipv4.ip_unprivileged_port_start.*/net.ipv4.ip_unprivileged_port_start=0/' /etc/sysctl.conf \
  || echo 'net.ipv4.ip_unprivileged_port_start=0' >> /etc/sysctl.conf

echo "✅ Permanent fix applied. Any user can now bind to port 80."

