#cloud-config

write_files:
- path: /etc/systemd/system/sshd-correct.service
  permissions: 0644
  owner: root
  content: |
    [Unit]
    Description=OpenSSH server daemon except custom port from Google
    After=syslog.target sshd.service network.target auditd.service

    [Service]
    ExecStartPre=/usr/bin/ssh-keygen -A
    ExecStart=/usr/sbin/sshd -D -e -p <%SHH_PORT%>
    ExecReload=/bin/kill -HUP $MAINPID

    [Install]
    WantedBy=multi-user.target

runcmd:
- systemctl daemon-reload
- systemctl stop sshd.service
- systemctl start sshd-correct.service

bootcmd:
- iptables -w -A INPUT -p tcp --dport <%SHH_PORT%> -j ACCEPT
