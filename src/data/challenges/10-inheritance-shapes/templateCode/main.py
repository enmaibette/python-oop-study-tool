class Shape:
    # TODO: Define __init__(self, color, x, y) and assign self.color, self.x, self.y

    # TODO: Define draw(self) that does nothing (use pass)
    pass


class Line(Shape):
    # TODO: Define __init__(self, color, x, y, length), call super().__init__(color, x, y), assign self.length

    # TODO: Override draw(self) to call canvas.draw_line(self.x, self.y, self.x + self.length, self.y, color=self.color)
    pass


class Cross(Shape):
    # TODO: Define __init__(self, color, x, y, size), call super().__init__(color, x, y), assign self.size
    # TODO: Override draw(self) so it calls canvas.draw_line twice to draw an X shape
    pass


# TODO: Create line = Line("red", 50, 50, 300) and call line.draw()


# TODO: Create cross = Cross("blue", 100, 50, 200) and call cross.draw()