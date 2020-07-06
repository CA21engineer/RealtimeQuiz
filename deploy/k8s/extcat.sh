#!/bin/bash

# chmod +x ./extcat.sh
# <% HOME %> -> $HOST -> 変数のなかみ
# cat log.tpl | ./extcat.sh > log

export TPL_LEFT=${TPL_LEFT:-"<%"}
export TPL_RIGHT=${TPL_RIGHT:-"%>"}

bash <<< "cat <<< "\""$(cat $@ | sed -E "s|\\$|DOLLAR_MARK|g" | sed -E "s|\"|DUBLE_MARK|g" | sed -E "s|${TPL_LEFT}\ *([^ ]+)\ *${TPL_RIGHT}|$\1|g")"\""" | sed -E "s|DOLLAR_MARK|\\$|g" | sed -E "s|DUBLE_MARK|\"|g"
